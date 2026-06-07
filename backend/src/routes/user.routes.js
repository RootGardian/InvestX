const express = require('express');
const { getProfile, updateProfile, depositFunds } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/deposit', depositFunds);

module.exports = router;
