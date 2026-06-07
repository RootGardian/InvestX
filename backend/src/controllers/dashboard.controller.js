const prisma = require('../utils/prisma');
const marketService = require('../services/market.service');

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                assets: true,
                transactions: {
                    orderBy: { timestamp: 'desc' },
                    take: 5
                }
            }
        });

        let totalPortfolioValue = 0;
        const portfolioWithCurrentPrices = await Promise.all(
            user.assets.map(async (asset) => {
                let currentPrice = 0;
                let currentTotalValue = 0;
                let performance = 0;
                
                try {
                    const quote = await marketService.getStockQuote(asset.ticker);
                    currentPrice = quote.price;
                    currentTotalValue = currentPrice * Number(asset.quantity);
                    totalPortfolioValue += currentTotalValue;
                    
                    const buyValue = Number(asset.averageBuyPrice) * Number(asset.quantity);
                    performance = ((currentTotalValue - buyValue) / buyValue) * 100;
                } catch (err) {
                    console.error(`Could not fetch quote for ${asset.ticker}`);
                }

                return {
                    ...asset,
                    currentPrice,
                    currentTotalValue,
                    performancePercentage: performance.toFixed(2)
                };
            })
        );

        res.json({
            cashBalance: user.cashBalance,
            totalPortfolioValue,
            totalAssetsValue: totalPortfolioValue + Number(user.cashBalance),
            assets: portfolioWithCurrentPrices,
            recentTransactions: user.transactions
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getDashboardSummary,
    getTransactionHistory
};
