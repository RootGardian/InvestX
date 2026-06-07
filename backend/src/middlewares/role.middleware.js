const prisma = require('../utils/prisma');

/**
 * RBAC Middleware — Restricts access based on user role.
 * Usage: roleMiddleware('ADMIN') or roleMiddleware('ADMIN', 'USER')
 */
const roleMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: 'Access denied. Insufficient permissions.',
                    requiredRole: allowedRoles,
                    yourRole: user.role
                });
            }

            req.user.role = user.role;
            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = roleMiddleware;
