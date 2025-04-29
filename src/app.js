const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require("cors")

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // your React app origin
    credentials: true,              // allow credentials (cookies)
  }));
  
// Routes
  app.use('/auth', authRoutes);
  app.use('/session', sessionRoutes);

module.exports = app;
