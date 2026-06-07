const express = require('express');
const { analyzeSentiment, getSentimentHistory, debugPipeline } = require('../controllers/sentiment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Analyze sentiment for a ticker (runs full NLP pipeline)
router.post('/analyze/:ticker', analyzeSentiment);

// Get stored sentiment history
router.get('/history/:ticker', getSentimentHistory);

// Debug: show pipeline steps for arbitrary text
router.post('/debug', debugPipeline);

module.exports = router;
