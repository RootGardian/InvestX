const marketService = require('../services/market.service');

const getQuote = async (req, res) => {
    try {
        const { ticker } = req.params;
        const quote = await marketService.getStockQuote(ticker);
        res.json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuotesBatch = async (req, res) => {
    try {
        const { tickers } = req.query; // Expecting comma separated like ?tickers=BTC,ETH,SOL
        if (!tickers) {
            return res.status(400).json({ message: 'Tickers parameter is required' });
        }
        
        const tickerArray = tickers.split(',').map(t => t.trim());
        const quotes = await Promise.all(
            tickerArray.map(async (ticker) => {
                try {
                    const quote = await marketService.getStockQuote(ticker);
                    return { ticker, ...quote };
                } catch (err) {
                    return { ticker, error: 'Failed to fetch quote' };
                }
            })
        );
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCandles = async (req, res) => {
    try {
        const { ticker } = req.params;
        const { period1, period2, interval } = req.query;
        
        if (!period1) {
            return res.status(400).json({ message: 'period1 (start date) is required' });
        }

        const candles = await marketService.getStockCandles(
            ticker, 
            period1, 
            period2 || new Date().toISOString(), 
            interval
        );
        res.json(candles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExchangeRate = async (req, res) => {
    try {
        const { base, target } = req.query;
        if (!base || !target) {
            return res.status(400).json({ message: 'Base and target currencies are required' });
        }

        const rate = await marketService.getExchangeRate(base, target);
        res.json({ base, target, rate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuote,
    getQuotesBatch,
    getCandles,
    getExchangeRate
};
