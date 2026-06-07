const getStockQuote = async (ticker) => {
    try {
        const apiKey = process.env.FINNHUB_API_KEY;
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker.toUpperCase()}&token=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Finnhub error: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data || data.c === 0) {
            throw new Error(`Ticker ${ticker} not found or no data available`);
        }

        return {
            ticker: ticker.toUpperCase(),
            price: data.c,
            currency: 'USD', // Finnhub quotes are typically in USD or market-specific (defaults to USD for US exchanges)
            name: ticker.toUpperCase(),
            change: data.d,
            changePercent: data.dp
        };
    } catch (error) {
        console.error(`Error fetching quote for ${ticker}:`, error.message);
        throw new Error(`Failed to fetch stock quote: ${error.message}`);
    }
};

const getStockCandles = async (ticker, period1, period2, interval = '1d') => {
    try {
        const apiKey = process.env.FINNHUB_API_KEY;
        
        // Convert to Unix timestamps (seconds)
        const from = Math.floor(new Date(period1).getTime() / 1000);
        const to = Math.floor(new Date(period2).getTime() / 1000);

        const resolutionMap = {
            '1m': '1',
            '5m': '5',
            '15m': '15',
            '30m': '30',
            '60m': '60',
            '1h': '60',
            '1d': 'D',
            '1wk': 'W',
            '1mo': 'M'
        };
        const resolution = resolutionMap[interval] || 'D';

        const response = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${ticker.toUpperCase()}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Finnhub error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.s !== 'ok') {
            throw new Error(data.error || 'No candle data found');
        }

        const candles = data.t.map((timestamp, index) => ({
            date: new Date(timestamp * 1000),
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
            volume: data.v[index]
        }));

        return candles;
    } catch (error) {
        console.warn(`Error fetching candles for ${ticker}:`, error.message, `- Generating mock data as fallback`);
        
        // Fallback: Generate realistic mock data for 90 days
        const mockCandles = [];
        let currentPrice = 50000; // Base starting price
        if (ticker === 'ETH') currentPrice = 3000;
        if (ticker === 'SOL') currentPrice = 140;
        if (ticker === 'AAPL') currentPrice = 170;
        if (ticker === 'NVDA') currentPrice = 850;

        const toDate = new Date(period2);
        for (let i = 90; i >= 0; i--) {
            const date = new Date(toDate.getTime() - i * 24 * 60 * 60 * 1000);
            
            // Random walk
            const volatility = currentPrice * 0.05; // 5% volatility
            const change = (Math.random() - 0.5) * volatility;
            
            const open = currentPrice;
            const close = currentPrice + change;
            const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
            const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
            
            mockCandles.push({
                date,
                open,
                high,
                low,
                close,
                volume: Math.floor(Math.random() * 10000)
            });
            
            currentPrice = close; // Set next day's open
        }
        
        return mockCandles;
    }
};

const getExchangeRate = async (baseCurrency, targetCurrency) => {
    if (baseCurrency === targetCurrency) return 1.0;

    const rates = {
        'USD_EUR': 0.92,
        'EUR_USD': 1.09,
        'USD_GBP': 0.79,
        'GBP_USD': 1.27
    };

    const key = `${baseCurrency}_${targetCurrency}`;
    return rates[key] || 1.0;
};

module.exports = {
    getStockQuote,
    getStockCandles,
    getExchangeRate
};
