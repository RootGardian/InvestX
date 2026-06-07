const sentimentService = require('../services/sentiment.service');

/**
 * Analyze sentiment for a ticker — runs the full NLP pipeline.
 * POST /api/sentiment/analyze/:ticker
 */
const analyzeSentiment = async (req, res) => {
    try {
        const { ticker } = req.params;
        const result = await sentimentService.analyzeTickerSentiment(ticker);
        res.json(result);
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get stored sentiment history for a ticker.
 * GET /api/sentiment/history/:ticker
 */
const getSentimentHistory = async (req, res) => {
    try {
        const { ticker } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const results = await sentimentService.getSentimentHistory(ticker, limit);
        res.json(results);
    } catch (error) {
        console.error('Sentiment history error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Debug endpoint — shows the NLP pipeline steps for a given text.
 * POST /api/sentiment/debug
 * Body: { text: "Apple stock surges after record earnings" }
 */
const debugPipeline = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'text is required' });
        }

        let tokens = sentimentService.tokenize(text, 'en');
        const lang = sentimentService.detectLanguage(tokens);
        if (lang === 'fr') {
            tokens = sentimentService.tokenize(text, 'fr');
        }
        
        const filtered = sentimentService.removeStopWords(tokens, lang);
        const stemmed = sentimentService.stemTokens(filtered, lang);
        const sentiment = sentimentService.scoreSentiment(text, lang);
        const label = sentimentService.classifySentiment(sentiment.comparative);

        res.json({
            input: text,
            detectedLanguage: lang,
            pipeline: {
                step1_tokenization: tokens,
                step2_stopWordRemoval: filtered,
                step3_stemming: stemmed,
                step4_sentiment: sentiment,
                step5_classification: label
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    analyzeSentiment,
    getSentimentHistory,
    debugPipeline
};
