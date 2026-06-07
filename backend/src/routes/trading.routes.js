const express = require('express');
const { buyAsset, sellAsset } = require('../controllers/trading.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/buy', buyAsset);
router.post('/sell', sellAsset);

module.exports = router;
