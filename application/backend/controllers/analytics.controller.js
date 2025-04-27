const { WebSocket } = require('ws');
const APIKeyModel = require("../models/APIKey.model.js");
const LogModel = require("../models/log.model.js");
const { getServerPyClient } = require('../sockets/ws.controller.js');

exports.getAnalytics = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key missing in x-ford header'
      });
    }

    const validKey = await APIKeyModel.findOne({ key: apiKey });
    if (!validKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API Key'
      });
    }

    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    // Fetch logs only for this API key within the last 3 minutes
    const recentLogs = await LogModel.find({
      apiKey: apiKey,
      timestamp: { $gte: threeMinutesAgo }
    }).sort({ timestamp: -1 });

    // Send recent logs to server.py for anomaly detection
    const logs = recentLogs.map(log => ({
      ip: log.ip || "unknown",
      timestamp: log.timestamp || new Date().toISOString(),
      method: log.method || "GET",
      url: log.url || "/",
      protocol: log.protocol || "HTTP/1.1",
      status_code: log.statusCode || 200,
      bytes_sent: log.bytesSent || 0,
      user_agent: log.userAgent || "unknown"
    }));

    try {
      // Get the WebSocket client
      const serverPyClient = getServerPyClient();

      if (!serverPyClient || serverPyClient.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket connection to server.py is not available');
      }

      // Create a promise that will resolve when we get the anomaly response
      const anomalyPromise = new Promise((resolve, reject) => {
        const messageHandler = (data) => {
          try {
            const message = JSON.parse(data);
            console.log('📨 Received anomaly data:', message);

            // Check if this is an anomaly response
            if (message.type === 'logs_received') {
              // Remove the listener so we don't handle other messages
              serverPyClient.removeListener('message', messageHandler);
              resolve(message);
            }
          } catch (err) {
            console.error('❌ Failed to parse anomaly response:', err);
          }
        };

        // Add temporary message handler
        serverPyClient.on('message', messageHandler);

        // Set timeout for response
        setTimeout(() => {
          serverPyClient.removeListener('message', messageHandler);
          reject(new Error('Anomaly detection timed out'));
        }, 5000);
      });

      // Send logs through WebSocket
      serverPyClient.send(JSON.stringify({ logs }));

      // Wait for the anomaly response
      const anomalyResult = await anomalyPromise;

      // Merge the anomaly results with the original logs
      const logsWithAnomalies = recentLogs.map(log => {
        const anomalyData = anomalyResult.logs.find(
          aLog => aLog.timestamp === log.timestamp &&
            aLog.ip === log.ip &&
            aLog.method === log.method &&
            aLog.url === log.url
        );
        return {
          ...log.toObject(),
          is_anomaly: anomalyData ? anomalyData.is_anomaly : false,
          anomaly_score: anomalyData ? anomalyData.anomaly_score : null
        };
      });

      // Return the enhanced logs with anomaly information
      res.status(200).json({
        success: true,
        count: logsWithAnomalies.length,
        data: logsWithAnomalies,
        anomaly_summary: {
          total_logs: anomalyResult.total_logs,
          anomalies_detected: anomalyResult.anomalies_detected
        }
      });

    } catch (error) {
      console.error('❌ Error during anomaly detection:', error.message);
      // Still return logs even if anomaly detection failed
      res.status(200).json({
        success: true,
        count: recentLogs.length,
        data: recentLogs.map(log => ({
          ...log.toObject(),
          is_anomaly: false,
          anomaly_score: null
        })),
        anomalyError: error.message
      });
    }
  } catch (err) {
    console.error('❌ Error fetching analytics:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


exports.getYearlyLogs = async (req, res) => {
  let apiKey = req.headers['x-ford'];
  try {
    const logsPerMonth = await LogModel.aggregate([
      {
        $match: {
          apiKey: apiKey,
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          totalLogs: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const formattedData = logsPerMonth.map(item => ({
      year: item._id.year,
      month: item._id.month,
      totalLogs: item.totalLogs
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('❌ Error fetching total logs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.getMonthlyLogs = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const logsByMethod = await LogModel.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: "$method",
          totalLogs: { $sum: 1 }
        }
      },
      {
        $sort: { totalLogs: -1 }
      }
    ]);

    const formattedData = logsByMethod.map(item => ({
      method: item._id,
      totalLogs: item.totalLogs
    }));

    res.status(200).json({
      success: true,
      month: now.getMonth() + 1, // (month is 0-indexed)
      year: now.getFullYear(),
      data: formattedData
    });

  } catch (error) {
    console.error('❌ Error fetching current month logs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


exports.getTopEndpoints = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];
    if (!apiKey) {
      return res.status(400).json({ success: false, message: "API Key missing" });
    }

    const endpoints = await LogModel.aggregate([
      { $match: { apiKey } },
      {
        $group: {
          _id: "$url",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ success: true, data: endpoints });
  } catch (error) {
    console.error('❌ getTopEndpoints error:', error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getStatusCodeDistribution = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];
    if (!apiKey) {
      return res.status(400).json({ success: false, message: "API Key missing" });
    }

    const statusDistribution = await LogModel.aggregate([
      { $match: { apiKey } },
      {
        $group: {
          _id: "$statusCode",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ success: true, data: statusDistribution });
  } catch (error) {
    console.error('❌ getStatusCodeDistribution error:', error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMethodDistribution = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];
    if (!apiKey) {
      return res.status(400).json({ success: false, message: "API Key missing" });
    }

    const methodDistribution = await LogModel.aggregate([
      { $match: { apiKey } },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ success: true, data: methodDistribution });
  } catch (error) {
    console.error('❌ getMethodDistribution error:', error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.overview = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];
    if (!apiKey) {
      return res.status(400).json({ success: false, message: "API Key missing" });
    }

    const overviewData = await LogModel.aggregate([
      { $match: { apiKey } },
      {
        $addFields: {
          bytesSentNumber: { $toDouble: "$bytesSent" }, // Convert 'bytesSent' string to number
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgBytesSent: { $avg: "$bytesSentNumber" },
          maxBytesSent: { $max: "$bytesSentNumber" }, // Find the maximum response size
        }
      }
    ]);

    if (!overviewData.length) {
      return res.status(200).json({
        success: true,
        data: {
          totalRequests: 0,
          avgBytesSent: 0,
          maxBytesSent: 0
        }
      });
    }

    const { totalRequests, avgBytesSent, maxBytesSent } = overviewData[0];

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        avgBytesSent: Number(avgBytesSent.toFixed(2)),
        maxBytesSent
      }
    });

  } catch (error) {
    console.error('❌ overview error:', error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.getRecentLogs = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key missing in x-ford header'
      });
    }

    const validKey = await APIKeyModel.findOne({ key: apiKey });
    if (!validKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API Key'
      });
    }

    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    // Fetch logs only for this API key within the last 3 minutes
    const recentLogs = await LogModel.find({
      apiKey: apiKey,
      timestamp: { $gte: threeMinutesAgo }
    }).sort({ timestamp: -1 });

    //send logs to frontend
    res.status(200).json({
      success: true,
      data: recentLogs
    });

  } catch (err) {
    console.error('❌ Error fetching analytics:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};