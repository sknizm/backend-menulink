const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const sessionRoutes = require('./routes/sessionRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
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
  
  const uploadPath = path.resolve(__dirname, 'assets/uploads');
  app.use('/uploads', express.static(uploadPath));
  
// Routes
  app.use('/upload', uploadRoutes);

  app.use('/auth', authRoutes);
  app.use('/session', sessionRoutes);

  app.use('/restaurant', restaurantRoutes);
  app.use('/menu', menuRoutes);


module.exports = app;
