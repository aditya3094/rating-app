// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/rating');
const adminRoutes = require('./routes/admin');
const ownerRoutes = require('./routes/owner');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// API routes (prefix /api)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Rating App Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
