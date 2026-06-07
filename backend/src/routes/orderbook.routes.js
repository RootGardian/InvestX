const express = require('express');
const { placeOrder, cancelOrder, getOrderBook, getMyOrders } = require('../controllers/orderbook.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Place a limit order
router.post('/orders', placeOrder);

// Get current user's orders
router.get('/my-orders', getMyOrders);

// Get the order book for a ticker
router.get('/:ticker', getOrderBook);

// Cancel an order
router.delete('/orders/:id', cancelOrder);

module.exports = router;
