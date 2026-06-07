const { hashPassword } = require('../utils/crypto');
const prisma = require('../utils/prisma');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                currency: true,
                cashBalance: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { avatarUrl, currency, password } = req.body;

        const dataToUpdate = {};
        if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;
        if (currency !== undefined) dataToUpdate.currency = currency;

        if (password) {
            dataToUpdate.passwordHash = await hashPassword(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                currency: true,
                cashBalance: true
            }
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const depositFunds = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                cashBalance: {
                    increment: amount
                }
            },
            select: {
                cashBalance: true
            }
        });

        // Optional: Create a transaction record for the deposit
        await prisma.transaction.create({
            data: {
                userId,
                ticker: 'USD', // representing cash
                type: 'DEPOSIT',
                quantity: amount,
                pricePerShare: 1,
                totalAmount: amount,
                currency: 'USD'
            }
        });

        res.json({ message: 'Deposit successful', cashBalance: updatedUser.cashBalance });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    depositFunds
};
