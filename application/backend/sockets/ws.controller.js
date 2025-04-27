const WebSocket = require('ws');
const ApiKeyModel = require('../models/APIKey.model');
const LogModel = require('../models/log.model');

// Store connected clients with their API keys
const connectedClients = new Map();

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
                    connectedClients.set(ws, data.apiKey);
                    console.log('🔐 Client authenticated with API key:', data.apiKey);
                    
                    // Send last 100 logs immediately after authentication
                    const recentLogs = await LogModel.find({ apiKey: data.apiKey })
                        .sort({ timestamp: -1 })
                        .limit(100)
                        .lean()
                        .exec();
                    
                    // Ensure bytesSent is a number
                    const processedLogs = recentLogs.map(log => ({
                        ...log,
                        bytesSent: parseInt(log.bytesSent) || 0
                    }));
                    
                    ws.send(JSON.stringify({
                        type: 'initial_logs',
                        logs: processedLogs
                    }));
                    
                    return;
                }

                if (!isAuthenticated) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
                    return;
                }
            } catch (err) {
                console.error('❌ Error processing message:', err);
            }
        });

        ws.on('close', () => {
            console.log('🔌 Client disconnected');
            connectedClients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            connectedClients.delete(ws);
        });
    });
}

// Broadcast log to relevant clients
function broadcastLog(log) {
    // Ensure bytesSent is a number before broadcasting
    const processedLog = {
        ...log,
        bytesSent: parseInt(log.bytesSent) || 0
    };

    connectedClients.forEach((apiKey, ws) => {
        if (ws.readyState === WebSocket.OPEN && apiKey === log.apiKey) {
            ws.send(JSON.stringify({
                type: 'log',
                log: processedLog
            }));
        }
    });
}

module.exports = { 
    setupWebSocket,
    broadcastLog
};
