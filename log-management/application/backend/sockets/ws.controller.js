const WebSocket = require('ws');
const ApiKeyModel = require('../models/APIKey.model');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server, path: "/ws" });

    wss.on('connection', (ws) => {
        console.log('🌐 New WebSocket connection');

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
                    console.log('📥 Received log:', data.log);
                }
            } catch (err) {
                console.error('⚠️ Failed to process message:', err.message);
                ws.send(JSON.stringify({ type: 'error', message: 'Malformed request' }));
            }
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket connection closed');
        });
    });
}

module.exports = setupWebSocket;
