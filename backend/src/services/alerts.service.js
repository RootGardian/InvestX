const prisma = require('../utils/prisma');
const marketService = require('./market.service');

/**
 * Background worker to check active price alerts
 */
const checkAlerts = async () => {
    try {
        const activeAlerts = await prisma.priceAlert.findMany({
            where: { isActive: true }
        });

        if (activeAlerts.length === 0) return;

        // Group by ticker to minimize API calls
        const tickers = [...new Set(activeAlerts.map(a => a.ticker))];
        const quotes = {};

        for (const ticker of tickers) {
            try {
                const quote = await marketService.getStockQuote(ticker);
                quotes[ticker] = Number(quote.price);
            } catch (err) {
                // Ignore quote errors for now, might be due to API rate limit
                console.error(`Alert check: Failed to get quote for ${ticker}`, err.message);
            }
        }

        // Evaluate alerts
        for (const alert of activeAlerts) {
            const currentPrice = quotes[alert.ticker];
            if (!currentPrice) continue;

            const target = Number(alert.targetPrice);
            let triggered = false;
            let message = '';

            if (alert.condition === 'ABOVE' && currentPrice >= target) {
                triggered = true;
                message = `L'actif ${alert.ticker} a dépassé votre prix cible de $${target.toFixed(2)}. Prix actuel: $${currentPrice.toFixed(2)}`;
            } else if (alert.condition === 'BELOW' && currentPrice <= target) {
                triggered = true;
                message = `L'actif ${alert.ticker} a chuté sous votre prix cible de $${target.toFixed(2)}. Prix actuel: $${currentPrice.toFixed(2)}`;
            }

            if (triggered) {
                await prisma.$transaction([
                    // Mark alert as inactive
                    prisma.priceAlert.update({
                        where: { id: alert.id },
                        data: { isActive: false }
                    }),
                    // Create a notification
                    prisma.notification.create({
                        data: {
                            userId: alert.userId,
                            title: `Alerte de Prix: ${alert.ticker}`,
                            message: message
                        }
                    })
                ]);
            }
        }
    } catch (error) {
        console.error('Error in checkAlerts worker:', error.message);
    }
};

/**
 * Start the background worker
 */
const startWorker = () => {
    // Run every minute
    const INTERVAL_MS = 60 * 1000;
    setInterval(checkAlerts, INTERVAL_MS);
    console.log(`[Worker] Price alerts worker started (interval: 1m)`);
};

module.exports = {
    checkAlerts,
    startWorker
};
