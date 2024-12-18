// app.js
// Import required modules
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const session = require('express-session');
const pool = require('./config/db');
const settings = require('./config/settings.json');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const port = settings.server.port;

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'www')));

// Configure session middleware
app.use(session({
    secret: settings.server.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: settings.server.cookieAge }
}));

// Use user routes
app.use('/api/users', userRoutes);

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'html', 'index.html'));
});

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
});

// Function to watch a directory for changes and notify JS to Update the page
const watchDirectory = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        files.forEach((file) => {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                watchDirectory(fullPath);
            } else {
                fs.watch(fullPath, (eventType, filename) => {
                    if (eventType === 'change') {
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send('reload');
                            }
                        });
                    }
                });
            }
        });
    });
};

// Watch the 'www' directory for changes
watchDirectory(path.join(__dirname, 'www'));

// Start the server
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});