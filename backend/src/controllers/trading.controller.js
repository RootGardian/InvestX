const prisma = require('../utils/prisma');
const marketService = require('../services/market.service');

const buyAsset = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ticker, quantity } = req.body;

        if (!ticker || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Valid ticker and quantity are required' });
        }

        // Fetch current market price
        const quote = await marketService.getStockQuote(ticker);
        const currentPrice = quote.price;

        if (!currentPrice) {
            return res.status(400).json({ message: 'Unable to fetch current price for ticker' });
        }

        const totalAmount = currentPrice * quantity;

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });

            if (user.cashBalance < totalAmount) {
                throw new Error('Insufficient cash balance');
            }

            // Deduct cash balance
            await tx.user.update({
                where: { id: userId },
                data: { cashBalance: { decrement: totalAmount } }
            });

            // Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    ticker,
                    type: 'BUY',
                    quantity,
                    pricePerShare: currentPrice,
                    totalAmount,
                    currency: quote.currency || 'USD'
                }
            });

            // Handle PortfolioAsset (PUMP Algorithm)
            const existingAsset = await tx.portfolioAsset.findFirst({
                where: { userId, ticker }
            });

            let portfolioAsset;
            if (existingAsset) {
                // Calculate PUMP (Average Buy Price)
                const oldQuantity = Number(existingAsset.quantity);
                const oldAvgPrice = Number(existingAsset.averageBuyPrice);
                const newQuantity = oldQuantity + Number(quantity);
                
                const newAvgPrice = ((oldQuantity * oldAvgPrice) + (Number(quantity) * currentPrice)) / newQuantity;

                portfolioAsset = await tx.portfolioAsset.update({
                    where: { id: existingAsset.id },
                    data: {
                        quantity: newQuantity,
                        averageBuyPrice: newAvgPrice
                    }
                });
            } else {
                portfolioAsset = await tx.portfolioAsset.create({
                    data: {
                        userId,
                        ticker,
                        quantity,
                        averageBuyPrice: currentPrice
                    }
                });
            }

            return { transaction, portfolioAsset };
        });

        res.status(201).json({ message: 'Buy successful', ...result });

    } catch (error) {
        console.error('Buy asset error:', error);
        res.status(400).json({ message: error.message || 'Transaction failed' });
    }
};

const sellAsset = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ticker, quantity } = req.body;

        if (!ticker || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Valid ticker and quantity are required' });
        }

        // Fetch current market price
        const quote = await marketService.getStockQuote(ticker);
        const currentPrice = quote.price;

        if (!currentPrice) {
            return res.status(400).json({ message: 'Unable to fetch current price for ticker' });
        }

        const totalAmount = currentPrice * quantity;

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            const existingAsset = await tx.portfolioAsset.findFirst({
                where: { userId, ticker }
            });

            if (!existingAsset || existingAsset.quantity < quantity) {
                throw new Error('Insufficient asset quantity in portfolio');
            }

            // Increase cash balance
            await tx.user.update({
                where: { id: userId },
                data: { cashBalance: { increment: totalAmount } }
            });

            // Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    ticker,
                    type: 'SELL',
                    quantity,
                    pricePerShare: currentPrice,
                    totalAmount,
                    currency: quote.currency || 'USD'
                }
            });

            // Update or delete PortfolioAsset
            const newQuantity = Number(existingAsset.quantity) - Number(quantity);
            let portfolioAsset;

            if (newQuantity === 0) {
                portfolioAsset = await tx.portfolioAsset.delete({
                    where: { id: existingAsset.id }
                });
            } else {
                portfolioAsset = await tx.portfolioAsset.update({
                    where: { id: existingAsset.id },
                    data: { quantity: newQuantity }
                });
            }

            return { transaction, portfolioAsset };
        });

        res.status(200).json({ message: 'Sell successful', ...result });

    } catch (error) {
        console.error('Sell asset error:', error);
        res.status(400).json({ message: error.message || 'Transaction failed' });
    }
};

module.exports = {
    buyAsset,
    sellAsset
};
