'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var cors = require('cors');

var oas3Tools = require('oas3-tools');
var { connectDB } = require('./utils/mongoUtil');
var { verifyJWT, verifyAdminJWT } = require('./middleware/authMiddleware');
var { initializeSocket } = require('./utils/socketUtil');

var serverPort = process.env.NODE_PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://admin:admin@mongodb/movie_booking?authSource=admin';

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers'),
    },
    openApiValidator: {
        validateSecurity: {
            handlers: {
                BearerAuth: verifyJWT,
                AdminAuth: verifyAdminJWT
            }
        }
    }
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = express();

// Apply CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, '/assets')));

app.use(expressAppConfig.getApp());

// Initialize the MongoDB connection and start the server
connectDB(mongoUri).then(() => {
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    server.listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        console.log('Socket.IO is running on ws://localhost:%d', serverPort);
    });
}).catch(err => {
    console.error('Failed to start server', err);
});