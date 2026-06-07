const prisma = require('../utils/prisma');

/**
 * =====================================================
 *  MATCHING ENGINE — Internal Order Book
 * =====================================================
 *  Implements Price/Time priority (FIFO):
 *  - BUY orders match against the cheapest SELL orders first
 *  - SELL orders match against the most expensive BUY orders first
 *  - At equal price, the oldest order is filled first
 *
 *  Anti double-spending:
 *  - BUY: cash is reserved (deducted) at order placement
 *  - SELL: assets are reserved (deducted) at order placement
 *  - All matching runs inside prisma.$transaction for atomicity
 * =====================================================
 */

/**
 * Place a LIMIT order into the order book.
 * Immediately attempts to match against the opposite side.
 * Any unfilled remainder stays in the book as OPEN.
 */
const placeOrder = async (userId, ticker, side, price, quantity) => {
    const numPrice = Number(price);
    const numQuantity = Number(quantity);

    if (numPrice <= 0 || numQuantity <= 0) {
        throw new Error('Price and quantity must be positive');
    }

    // Everything runs inside one atomic transaction
    const result = await prisma.$transaction(async (tx) => {

        // ── 1. RESERVE FUNDS / ASSETS ───────────────────────────
        if (side === 'BUY') {
            const totalCost = numPrice * numQuantity;
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (Number(user.cashBalance) < totalCost) {
                throw new Error(`Insufficient cash. Need $${totalCost.toFixed(2)}, have $${Number(user.cashBalance).toFixed(2)}`);
            }
            // Reserve cash immediately to prevent double-spending
            await tx.user.update({
                where: { id: userId },
                data: { cashBalance: { decrement: totalCost } }
            });
        } else {
            // SELL — reserve assets
            const asset = await tx.portfolioAsset.findUnique({
                where: { userId_ticker: { userId, ticker } }
            });
            if (!asset || Number(asset.quantity) < numQuantity) {
                throw new Error(`Insufficient ${ticker} quantity. Need ${numQuantity}, have ${asset ? Number(asset.quantity) : 0}`);
            }
            await tx.portfolioAsset.update({
                where: { userId_ticker: { userId, ticker } },
                data: { quantity: { decrement: numQuantity } }
            });
            // Delete the asset row if quantity reaches 0
            const updated = await tx.portfolioAsset.findUnique({
                where: { userId_ticker: { userId, ticker } }
            });
            if (updated && Number(updated.quantity) === 0) {
                await tx.portfolioAsset.delete({
                    where: { userId_ticker: { userId, ticker } }
                });
            }
        }

        // ── 2. CREATE THE ORDER ─────────────────────────────────
        const order = await tx.order.create({
            data: {
                userId,
                ticker,
                side,
                price: numPrice,
                quantity: numQuantity,
                filledQuantity: 0,
                status: 'OPEN'
            }
        });

        // ── 3. ATTEMPT MATCHING ─────────────────────────────────
        const fills = await matchOrder(tx, order);

        // ── 4. RELOAD ORDER TO GET FINAL STATE ──────────────────
        const finalOrder = await tx.order.findUnique({ where: { id: order.id } });

        return { order: finalOrder, fills };
    });

    return result;
};

/**
 * Core matching algorithm — Price/Time FIFO priority.
 * Runs within the provided transaction context (tx).
 */
const matchOrder = async (tx, incomingOrder) => {
    const fills = [];
    let remainingQty = Number(incomingOrder.quantity) - Number(incomingOrder.filledQuantity);

    while (remainingQty > 0) {
        // Find the best matching order on the opposite side
        let matchingOrder;

        if (incomingOrder.side === 'BUY') {
            // BUY wants to match with the cheapest SELL at or below our price
            matchingOrder = await tx.order.findFirst({
                where: {
                    ticker: incomingOrder.ticker,
                    side: 'SELL',
                    status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
                    price: { lte: incomingOrder.price },
                    userId: { not: incomingOrder.userId } // Can't self-trade
                },
                orderBy: [
                    { price: 'asc' },      // Best price first
                    { createdAt: 'asc' }    // FIFO at same price
                ]
            });
        } else {
            // SELL wants to match with the highest BUY at or above our price
            matchingOrder = await tx.order.findFirst({
                where: {
                    ticker: incomingOrder.ticker,
                    side: 'BUY',
                    status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
                    price: { gte: incomingOrder.price },
                    userId: { not: incomingOrder.userId }
                },
                orderBy: [
                    { price: 'desc' },      // Best price first
                    { createdAt: 'asc' }     // FIFO at same price
                ]
            });
        }

        if (!matchingOrder) break; // No more matches available

        // ── DETERMINE FILL ──────────────────────────────────────
        const matchRemainingQty = Number(matchingOrder.quantity) - Number(matchingOrder.filledQuantity);
        const fillQty = Math.min(remainingQty, matchRemainingQty);
        const fillPrice = Number(matchingOrder.price); // Execute at the resting order's price (maker price)
        const fillTotal = fillQty * fillPrice;

        // Identify buyer and seller
        const buyerId = incomingOrder.side === 'BUY' ? incomingOrder.userId : matchingOrder.userId;
        const sellerId = incomingOrder.side === 'SELL' ? incomingOrder.userId : matchingOrder.userId;
        const buyOrderPrice = incomingOrder.side === 'BUY' ? Number(incomingOrder.price) : Number(matchingOrder.price);

        // ── TRANSFER CASH TO SELLER ─────────────────────────────
        await tx.user.update({
            where: { id: sellerId },
            data: { cashBalance: { increment: fillTotal } }
        });

        // If buyer placed order at a higher price than fill price, refund the difference
        if (incomingOrder.side === 'BUY') {
            const priceDiff = (buyOrderPrice - fillPrice) * fillQty;
            if (priceDiff > 0) {
                await tx.user.update({
                    where: { id: buyerId },
                    data: { cashBalance: { increment: priceDiff } }
                });
            }
        }

        // ── TRANSFER ASSETS TO BUYER ────────────────────────────
        const buyerAsset = await tx.portfolioAsset.findUnique({
            where: { userId_ticker: { userId: buyerId, ticker: incomingOrder.ticker } }
        });

        if (buyerAsset) {
            // PUMP: update average buy price
            const oldQty = Number(buyerAsset.quantity);
            const oldAvg = Number(buyerAsset.averageBuyPrice);
            const newTotalQty = oldQty + fillQty;
            const newAvg = ((oldQty * oldAvg) + (fillQty * fillPrice)) / newTotalQty;

            await tx.portfolioAsset.update({
                where: { userId_ticker: { userId: buyerId, ticker: incomingOrder.ticker } },
                data: {
                    quantity: newTotalQty,
                    averageBuyPrice: newAvg
                }
            });
        } else {
            await tx.portfolioAsset.create({
                data: {
                    userId: buyerId,
                    ticker: incomingOrder.ticker,
                    quantity: fillQty,
                    averageBuyPrice: fillPrice
                }
            });
        }

        // ── CREATE TRANSACTION RECORDS ───────────────────────────
        await tx.transaction.create({
            data: {
                userId: buyerId,
                ticker: incomingOrder.ticker,
                type: 'BUY',
                quantity: fillQty,
                pricePerShare: fillPrice,
                totalAmount: fillTotal
            }
        });
        await tx.transaction.create({
            data: {
                userId: sellerId,
                ticker: incomingOrder.ticker,
                type: 'SELL',
                quantity: fillQty,
                pricePerShare: fillPrice,
                totalAmount: fillTotal
            }
        });

        // ── UPDATE BOTH ORDERS ──────────────────────────────────
        const newIncomingFilled = Number(incomingOrder.filledQuantity) + fillQty;
        const newMatchFilled = Number(matchingOrder.filledQuantity) + fillQty;

        const incomingStatus = newIncomingFilled >= Number(incomingOrder.quantity) ? 'FILLED' : 'PARTIALLY_FILLED';
        const matchStatus = newMatchFilled >= Number(matchingOrder.quantity) ? 'FILLED' : 'PARTIALLY_FILLED';

        await tx.order.update({
            where: { id: incomingOrder.id },
            data: { filledQuantity: newIncomingFilled, status: incomingStatus }
        });
        await tx.order.update({
            where: { id: matchingOrder.id },
            data: { filledQuantity: newMatchFilled, status: matchStatus }
        });

        // Update in-memory tracking
        incomingOrder.filledQuantity = newIncomingFilled;
        remainingQty -= fillQty;

        fills.push({
            matchedOrderId: matchingOrder.id,
            matchedUserId: matchingOrder.userId,
            fillQuantity: fillQty,
            fillPrice,
            fillTotal
        });
    }

    return fills;
};

/**
 * Cancel an open order and refund the reserved cash/assets.
 */
const cancelOrder = async (userId, orderId) => {
    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } });

        if (!order) throw new Error('Order not found');
        if (order.userId !== userId) throw new Error('Unauthorized');
        if (order.status === 'FILLED' || order.status === 'CANCELLED') {
            throw new Error(`Cannot cancel order with status ${order.status}`);
        }

        const unfilledQty = Number(order.quantity) - Number(order.filledQuantity);

        if (order.side === 'BUY') {
            // Refund reserved cash for unfilled portion
            const refund = unfilledQty * Number(order.price);
            await tx.user.update({
                where: { id: userId },
                data: { cashBalance: { increment: refund } }
            });
        } else {
            // Refund reserved assets for unfilled portion
            const existingAsset = await tx.portfolioAsset.findUnique({
                where: { userId_ticker: { userId, ticker: order.ticker } }
            });

            if (existingAsset) {
                await tx.portfolioAsset.update({
                    where: { userId_ticker: { userId, ticker: order.ticker } },
                    data: { quantity: { increment: unfilledQty } }
                });
            } else {
                await tx.portfolioAsset.create({
                    data: {
                        userId,
                        ticker: order.ticker,
                        quantity: unfilledQty,
                        averageBuyPrice: Number(order.price)
                    }
                });
            }
        }

        // Mark order as cancelled
        const cancelled = await tx.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });

        return cancelled;
    });

    return result;
};

/**
 * Get the order book for a given ticker.
 * Returns aggregated BUY and SELL levels sorted by best price.
 */
const getOrderBook = async (ticker) => {
    const [buyOrders, sellOrders] = await Promise.all([
        prisma.order.findMany({
            where: {
                ticker,
                side: 'BUY',
                status: { in: ['OPEN', 'PARTIALLY_FILLED'] }
            },
            orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
            select: {
                id: true,
                userId: true,
                price: true,
                quantity: true,
                filledQuantity: true,
                createdAt: true
            }
        }),
        prisma.order.findMany({
            where: {
                ticker,
                side: 'SELL',
                status: { in: ['OPEN', 'PARTIALLY_FILLED'] }
            },
            orderBy: [{ price: 'asc' }, { createdAt: 'asc' }],
            select: {
                id: true,
                userId: true,
                price: true,
                quantity: true,
                filledQuantity: true,
                createdAt: true
            }
        })
    ]);

    // Aggregate by price level
    const aggregateLevels = (orders) => {
        const levels = {};
        for (const o of orders) {
            const p = Number(o.price).toFixed(4);
            if (!levels[p]) {
                levels[p] = { price: Number(p), totalQuantity: 0, orderCount: 0 };
            }
            levels[p].totalQuantity += Number(o.quantity) - Number(o.filledQuantity);
            levels[p].orderCount++;
        }
        return Object.values(levels);
    };

    return {
        ticker,
        bids: aggregateLevels(buyOrders),
        asks: aggregateLevels(sellOrders),
        rawBids: buyOrders,
        rawAsks: sellOrders
    };
};

module.exports = {
    placeOrder,
    cancelOrder,
    getOrderBook
};
