const prisma = require('../utils/prisma');

/**
 * Admin: Get all users
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                currency: true,
                cashBalance: true,
                createdAt: true,
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                        orders: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Update user role
 * PUT /api/admin/users/:id/role
 * Body: { role: "ADMIN" | "USER" }
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'role must be USER or ADMIN' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true }
        });

        res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Delete a user
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (id === req.user.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        // Delete related data first (cascade)
        await prisma.$transaction(async (tx) => {
            await tx.order.deleteMany({ where: { userId: id } });
            await tx.priceAlert.deleteMany({ where: { userId: id } });
            await tx.transaction.deleteMany({ where: { userId: id } });
            await tx.portfolioAsset.deleteMany({ where: { userId: id } });
            await tx.user.delete({ where: { id } });
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Platform statistics
 * GET /api/admin/stats
 */
const getPlatformStats = async (req, res) => {
    try {
        const [userCount, transactionCount, orderCount, activeAlerts] = await Promise.all([
            prisma.user.count(),
            prisma.transaction.count(),
            prisma.order.count(),
            prisma.priceAlert.count({ where: { isActive: true } })
        ]);

        const totalCash = await prisma.user.aggregate({
            _sum: { cashBalance: true }
        });

        const totalVolume = await prisma.transaction.aggregate({
            _sum: { totalAmount: true }
        });

        res.json({
            users: userCount,
            transactions: transactionCount,
            orders: orderCount,
            activeAlerts,
            totalCashInPlatform: totalCash._sum.cashBalance || 0,
            totalVolume: totalVolume._sum.totalAmount || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Get global history
 * GET /api/admin/history
 */
const getGlobalHistory = async (req, res) => {
    try {
        const history = await prisma.transaction.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        name: true
                    }
                }
            },
            orderBy: { timestamp: 'desc' }
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getPlatformStats,
    getGlobalHistory
};
