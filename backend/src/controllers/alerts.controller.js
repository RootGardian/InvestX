const prisma = require('../utils/prisma');

const createAlert = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ticker, targetPrice, condition } = req.body;

        if (!ticker || !targetPrice || !condition) {
            return res.status(400).json({ message: 'ticker, targetPrice, and condition (ABOVE/BELOW) are required' });
        }

        const alert = await prisma.priceAlert.create({
            data: {
                userId,
                ticker,
                targetPrice,
                condition
            }
        });

        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAlerts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const alerts = await prisma.priceAlert.findMany({
            where: { userId }
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAlert = async (req, res) => {
    try {
        const userId = req.user.userId;
        const alertId = req.params.id;
        const { isActive } = req.body;

        const alert = await prisma.priceAlert.updateMany({
            where: { id: alertId, userId },
            data: { isActive }
        });

        if (alert.count === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAlert = async (req, res) => {
    try {
        const userId = req.user.userId;
        const alertId = req.params.id;

        const result = await prisma.priceAlert.deleteMany({
            where: { id: alertId, userId }
        });

        if (result.count === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAlert,
    getAlerts,
    updateAlert,
    deleteAlert
};
