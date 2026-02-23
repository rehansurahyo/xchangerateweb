const cors = require('cors');

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        /\.vercel\.app$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-MBX-APIKEY'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
