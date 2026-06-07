const matchingService = require('../services/matching.service');

/**
 * Place a limit order into the internal order book.
 * POST /api/orderbook/orders
 * Body: { ticker, side, price, quantity }
 */
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ticker, side, price, quantity } = req.body;

        if (!ticker || !side || !price || !quantity) {
            return res.status(400).json({ message: 'ticker, side (BUY/SELL), price, and quantity are required' });
        }
        if (!['BUY', 'SELL'].includes(side)) {
            return res.status(400).json({ message: 'side must be BUY or SELL' });
        }

        const result = await matchingService.placeOrder(userId, ticker.toUpperCase(), side, price, quantity);

        const statusCode = result.fills.length > 0 ? 200 : 201;
        res.status(statusCode).json({
            message: result.fills.length > 0
                ? `Order placed and ${result.order.status === 'FILLED' ? 'fully' : 'partially'} matched`
                : 'Order placed in the order book',
            order: result.order,
            fills: result.fills
        });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Cancel an open order.
 * DELETE /api/orderbook/orders/:id
 */
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;

        const cancelled = await matchingService.cancelOrder(userId, orderId);

        res.json({ message: 'Order cancelled successfully', order: cancelled });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get the order book (bids & asks) for a given ticker.
 * GET /api/orderbook/:ticker
 */
const getOrderBook = async (req, res) => {
    try {
        const { ticker } = req.params;
        const book = await matchingService.getOrderBook(ticker.toUpperCase());

        res.json(book);
    } catch (error) {
        console.error('Get order book error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get current user's open orders.
 * GET /api/orderbook/my-orders
 */
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const prisma = require('../utils/prisma');

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    cancelOrder,
    getOrderBook,
    getMyOrders
};
