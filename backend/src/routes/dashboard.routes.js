const express = require('express');
const { getDashboardSummary, getTransactionHistory } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/transactions', getTransactionHistory);

module.exports = router;
