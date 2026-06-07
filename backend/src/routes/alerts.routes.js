const express = require('express');
const { createAlert, getAlerts, updateAlert, deleteAlert } = require('../controllers/alerts.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createAlert);
router.get('/', getAlerts);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
