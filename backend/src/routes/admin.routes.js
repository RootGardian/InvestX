const express = require('express');
const { getAllUsers, updateUserRole, deleteUser, getPlatformStats, getGlobalHistory } = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// All admin routes require auth + ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getPlatformStats);
router.get('/history', getGlobalHistory);

module.exports = router;
