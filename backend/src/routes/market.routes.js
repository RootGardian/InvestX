const express = require('express');
const { getQuote, getQuotesBatch, getCandles, getExchangeRate } = require('../controllers/market.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/quote/:ticker', getQuote);
router.get('/quotes-batch', getQuotesBatch);
router.get('/candles/:ticker', getCandles);
router.get('/exchange-rate', getExchangeRate);

module.exports = router;
