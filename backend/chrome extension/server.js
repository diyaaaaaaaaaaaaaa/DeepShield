// server.js - Main Express server for DeepShield API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import route handlers
const detectRoutes = require('./routes/detect');

// Create Express app
const app = express();

// Set port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE SETUP =====
// Security middleware - adds various HTTP headers for security
app.use(helmet());

// CORS middleware - allows Chrome extension to make requests to this API
app.use(cors({
    origin: ['chrome-extension://*', 'http://localhost:*'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Body parser middleware - converts JSON requests into JavaScript objects
app.use(express.json({ limit: '10mb' })); // 10mb limit for large text/image content
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Request body:', req.body);
    next();
});

// ===== ROUTES =====
// Health check endpoint - test if server is running
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'DeepShield API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Main API routes - all detection endpoints start with /api
app.use('/api', detectRoutes);

// Catch-all for unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
        availableEndpoints: [
            'GET /health - Check server status',
            'POST /api/detect/text - Detect AI-generated text'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error occurred:', error);
    res.status(error.status || 500).json({
        error: 'Internal server error',
        message: error.message || 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('🚀 DeepShield API Server Started');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log('🔍 Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   POST http://localhost:${PORT}/api/detect/text`);
    console.log('🛑 Press Ctrl+C to stop server');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Server interrupted. Shutting down...');
    process.exit(0);
});