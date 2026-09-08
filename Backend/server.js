const dotenv = require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes');
const noteRouter = require('./routes/noteRouter');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRouter);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('mongoDB server started');

        app.listen(process.env.PORT, () => {
            console.log(`server is running on port: ${process.env.PORT}`);
        });

    } catch (error) {
        console.error('Connection failed', error.message);
        process.exit(1);
    }
};

startServer();