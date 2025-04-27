const WebSocket = require('ws');
const ApiKeyModel = require('../models/APIKey.model');
const LogModel = require('../models/log.model');

// Setup WebSocket client for connecting to server.py
let serverPyClient = null;
const SERVER_PY_URL = process.env.GROQ_SERVER_WS;
//const SERVER_PY_URL = 'ws://127.0.0.1:5001/ws';
// const SERVER_PY_URL = 'ws://127.0.0.1:5001/ws/application';
function setupServerPyConnection() {
    if (serverPyClient && (serverPyClient.readyState === WebSocket.OPEN || serverPyClient.readyState === WebSocket.CONNECTING)) {
        return; // Connection already exists or is being established
    }

    serverPyClient = new WebSocket(SERVER_PY_URL);

    serverPyClient.on('open', () => {
        console.log('🔗 Connected to server.py analysis backend');
    });

    serverPyClient.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📨 Received from server.py:', message);
        } catch (err) {
            console.error('❌ Failed to parse message from server.py:', err);
        }
    });

    serverPyClient.on('error', (err) => {
        console.error('❌ server.py connection error:', err);
        setTimeout(setupServerPyConnection, 5000); // Try to reconnect
    });

    serverPyClient.on('close', () => {
        console.log('🔌 server.py connection closed, attempting to reconnect...');
        setTimeout(setupServerPyConnection, 5000);
    });
}

// Initialize connection immediately
setupServerPyConnection();

// Export getter for the WebSocket client
function getServerPyClient() {
    return serverPyClient;
}

// Forward logs to server.py
function forwardLogToServerPy(logData) {
    if (!serverPyClient || serverPyClient.readyState !== WebSocket.OPEN) {
        console.log('⚠️ Cannot forward log to server.py: connection not open');
        setTimeout(() => forwardLogToServerPy(logData), 1000); // Retry after 1 second
        return false;
    }

    try {
        serverPyClient.send(JSON.stringify({
            log: logData
        }));
        console.log('📤 Forwarded log to server.py');
        return true;
    } catch (err) {
        console.error('❌ Failed to forward log to server.py:', err.message);
        return false;
    }
}

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server, path: "/ws" });

    wss.on('connection', (ws) => {
        console.log('🌐 New WebSocket connection from client');

        let isAuthenticated = false;

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                if (data.type === 'auth') {
                    const validKey = await ApiKeyModel.findOne({ key: data.apiKey });

                    if (!validKey) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Invalid API Key' }));
                        ws.close();
                        return;
                    }

                    ws.apiKey = data.apiKey;
                    isAuthenticated = true;
                    console.log('🔐 Client authenticated');
                    return;
                }

                if (data.type === 'log') {
                    if (!isAuthenticated) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Unauthenticated. No logs accepted.' }));
                        ws.close();
                        return;
                    }
                    console.log('📥 Received log from client:', JSON.stringify(data.log).substring(0, 200) + '...');

                    // Store in MongoDB and forward to server.py
                    try {
                        let logdata = {
                            apiKey: data.apiKey,
                            ...data.log,
                        };
                        
                        // Save to MongoDB
                        const newLog = new LogModel(logdata);
                        await newLog.save();
                        console.log('✅ Log saved to MongoDB');

                        // Forward to server.py for analysis
                        forwardLogToServerPy(logdata);

                    } catch (err) {
                        console.error('⚠️ Error processing log:', err.message);
                    }
                }
            } catch (err) {
                console.error('⚠️ Failed to process message:', err.message);
                ws.send(JSON.stringify({ type: 'error', message: 'Malformed request' }));
            }
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket connection from client closed');
        });
    });
}

module.exports = { 
    setupWebSocket,
    getServerPyClient,
    forwardLogToServerPy
};
