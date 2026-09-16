const dotenv = require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

const authRoutes = require('./routes/authRoutes');
const noteRouter = require('./routes/noteRouter');

app.use(cors({
  origin: ['http://localhost:5173', 'https://notpad-flow.vercel.app'],
  credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to ensure MongoDB connection in serverless environment
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.get('/', (req, res) => {
    res.json({ status: "OK", message: "NotPad API Server Operating" });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRouter);

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
