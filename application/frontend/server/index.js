import express from 'express';
import winston from 'winston';
import morgan from 'morgan';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

// Helper function to read logs
const readLogs = () => {
  try {
    const combinedLogs = fs.readFileSync('logs/combined.log', 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
    
    const errorLogs = fs.readFileSync('logs/error.log', 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));

    return {
      combined: combinedLogs,
      errors: errorLogs
    };
  } catch (error) {
    console.error('Error reading log files:', error);
    return { combined: [], errors: [] };
  }
};

// Calculate stats from logs
const calculateStats = (logs) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return logs.reduce((stats, log) => {
    const logTime = new Date(log.timestamp);
    if (logTime > last24Hours) {
      stats.realtimeLogs++;
      if (log.level === 'warn' || log.level === 'error') {
        stats.anomalies++;
      }
      if (log.source === 'Database') {
        stats.dbLogs++;
      }
    }
    return stats;
  }, { realtimeLogs: 0, anomalies: 0, dbLogs: 0 });
};

// Calculate traffic data from logs
const calculateTrafficData = (logs) => {
  const trafficByHour = {};
  
  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours() + ':00';
    trafficByHour[hour] = (trafficByHour[hour] || 0) + 1;
  });

  return Object.entries(trafficByHour).map(([time, requests]) => ({
    time,
    requests
  }));
};

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);

  // Send initial data
  const logs = readLogs();
  const stats = calculateStats(logs.combined);
  const trafficData = calculateTrafficData(logs.combined);

  ws.send(JSON.stringify({
    type: 'initial',
    data: {
      logs: logs.combined.slice(-100),
      stats,
      trafficData
    }
  }));

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast log to all connected clients
const broadcastLog = (log) => {
  const message = JSON.stringify({ type: 'log', log });
  clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Custom middleware to log requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? 'warn' : 'info',
      message: `${req.method} ${req.path} ${res.statusCode}`,
      source: 'Web Server',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip
    };
    
    logger.info('Request processed', log);
    broadcastLog(log);
  });
  next();
});

// API routes
app.get('/api/logs', (req, res) => {
  const logs = readLogs();
  const stats = calculateStats(logs.combined);
  const trafficData = calculateTrafficData(logs.combined);

  res.json({
    logs: logs.combined.slice(-100),
    stats,
    trafficData
  });
});

app.post('/api/logs', (req, res) => {
  const logData = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  logger.info('Log data received', logData);
  broadcastLog(logData);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});