const WebSocket = require('ws');
const ApiKeyModel = require('../models/APIKey.model');
const LogModel = require('../models/log.model');

// Setup WebSocket client for connecting to server.py
let serverPyClient = null;
const SERVER_PY_URL = 'ws://127.0.0.1:5001/ws/application';

function setupServerPyConnection() {
    if (serverPyClient) {
        // Close existing connection
        serverPyClient.close();
    }

    console.log(`🔄 Connecting to server.py at ${SERVER_PY_URL}...`);
    serverPyClient = new WebSocket(SERVER_PY_URL);

    serverPyClient.on('open', () => {
        console.log('✅ Connected to server.py via WebSocket');
    });

    serverPyClient.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📥 Received from server.py:', message);
        } catch (err) {
            console.error('⚠️ Error parsing message from server.py:', err.message);
        }
    });

    serverPyClient.on('error', (err) => {
        console.error('❌ WebSocket error with server.py:', err.message);
    });

    serverPyClient.on('close', () => {
        console.log('🔌 WebSocket connection to server.py closed, retrying in 5s...');
        setTimeout(setupServerPyConnection, 5000);
    });
}

// Forward logs to server.py
function forwardLogToServerPy(logData) {
    if (!serverPyClient || serverPyClient.readyState !== WebSocket.OPEN) {
        console.log('⚠️ Cannot forward log to server.py: connection not open');
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

    // Setup connection to server.py
    setupServerPyConnection();

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
                    console.log(data.log)

                    // Forward the log to server.py
                    // forwardLogToServerPy(data.log);

                    try {
                        let logdata = {
                            apiKey: data.apiKey,
                            ...data.log,
                        };
                        console.log(logdata);
                        const newLog = new LogModel(logdata);
                        await newLog.save();
                        console.log('✅ Log saved to MongoDB');
                    } catch (err) {
                        console.error('⚠️ Failed to save log to MongoDB:', err.message);
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

module.exports = setupWebSocket;
