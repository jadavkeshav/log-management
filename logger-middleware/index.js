const WebSocket = require('ws');
const requestIp = require('request-ip');

const WS_SERVER_URL = 'ws://localhost:5000/ws';

function createLoggerMiddleware(apiKey) {
    if (!apiKey) {
        console.error('❌ API key not found, please set the API_KEY environment variable');
        process.exit(1);
    }

    let socket;

    function initWebSocket() {
        socket = new WebSocket(WS_SERVER_URL);

        socket.on('open', () => {
            console.log('✅ Connected to log server via WebSocket');
            socket.send(JSON.stringify({ type: 'auth', apiKey }));
        });

        socket.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'error') {
                console.error('❌ Authentication failed:', message.message);
                socket.close(); // Close on invalid API key
            }
        });

        socket.on('error', (err) => {
            console.error('❌ WebSocket error:', err.message);
        });

        socket.on('close', () => {
            console.log('🔌 WebSocket closed, retrying in 5s...');
            setTimeout(initWebSocket, 5000);
        });
    }

    initWebSocket();

    return (req, res, next) => {
        res.on('finish', () => {
            const clientIp = requestIp.getClientIp(req);

            const log = {
                type: 'log',
                apiKey: apiKey,
                log: {
                    ip: clientIp,
                    timestamp: new Date().toISOString(),
                    method: req.method,
                    url: req.originalUrl,
                    protocol: req.protocol,
                    statusCode: res.statusCode,
                    bytesSent: res.getHeader("Content-Length") || 0,
                    userAgent: req.headers["user-agent"],
                    url_length: req.originalUrl.length,
                    url_depth: req.originalUrl.split("/").filter(Boolean).length,
                    num_encoded_chars: (decodeURIComponent(req.originalUrl).match(/%[0-9A-Fa-f]{2}/g) || []).length,
                    num_special_chars: (req.originalUrl.match(/[^a-zA-Z0-9]/g) || []).length,
                }
            };

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(log));
                console.log('📤 Log sent via WebSocket');
            }
        });

        next();
    };
}

module.exports = createLoggerMiddleware;
