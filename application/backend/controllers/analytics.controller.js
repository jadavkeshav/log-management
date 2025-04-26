const APIKeyModel = require("../models/APIKey.model.js");
const LogModel = require("../models/log.model.js");

exports.getAnalytics = async (req, res) => {
  try {
    const apiKey = req.headers['x-ford'];

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key missing in x-ford header'
      });
    }

    // Optional: Validate API Key from DB if needed
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
      // Send logs to server.py for anomaly detection
      const anomalyResponse = await fetch('http://localhost:5001/anomaly_detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });

      if (!anomalyResponse.ok) {
        throw new Error(`Server responded with status: ${anomalyResponse.status}`);
      }

      const anomalyResults = await anomalyResponse.json();
      console.log(`✅ Anomaly detection completed with ${anomalyResults.current_analysis.anomalies_detected} anomalies found.`);

      // Return both current logs and historical context
      res.status(200).json({
        success: true,
        count: recentLogs.length,
        data: recentLogs,
        anomalyResults: {
          current: {
            total: anomalyResults.current_analysis.total_logs,
            anomaliesDetected: anomalyResults.current_analysis.anomalies_detected,
            anomalyDetails: anomalyResults.current_analysis.anomaly_details,
            logsWithFeatures: anomalyResults.current_analysis.logs_with_features,
          },
          historical: {
            totalLogsInBuffer: anomalyResults.historical_context.total_logs_in_buffer,
            recentLogs: anomalyResults.historical_context.recent_logs,
          },
          predictionTime: anomalyResults.prediction_time
        }
      });
    } catch (error) {
      console.error('❌ Error during anomaly detection:', error.message);
      // Still return logs even if anomaly detection failed
      res.status(200).json({
        success: true,
        count: recentLogs.length,
        data: recentLogs,
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