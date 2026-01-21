const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    // origin: process.env.NODE_ENV === 'production'
    //   ? corsOrigin.split(',').map(o => o.trim())
    //   : true,
    origin: true,
    credentials: true,
  })
);

// Rate limiting
app.use(rateLimiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dump Truck Management API is running' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
