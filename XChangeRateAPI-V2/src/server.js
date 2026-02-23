require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const corsMiddleware = require('./config/cors');
const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Security & Logging Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(corsMiddleware);

// 2. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 3. Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Routes
app.use('/api', apiRoutes);

// 5. 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found.`
    });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error('[GlobalErrorHandler]:', err.stack);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// 7. Start Server
app.listen(PORT, () => {
    console.log(`
================================================
🚀 XChangeRateAPI-V2 is running!
📡 URL: http://localhost:${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
================================================
    `);
});
