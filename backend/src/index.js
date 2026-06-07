const express = require('express');
const cors = require('cors');
require('dotenv').config();
// Trigger restart

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const marketRoutes = require('./routes/market.routes');
const tradingRoutes = require('./routes/trading.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const alertsRoutes = require('./routes/alerts.routes');
const orderbookRoutes = require('./routes/orderbook.routes');
const sentimentRoutes = require('./routes/sentiment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/orderbook', orderbookRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
