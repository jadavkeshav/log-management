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

        //TODO: RAM add ur logic here data is in rectLogs send data to server.py and get the response as well

        res.status(200).json({
            success: true,
            count: recentLogs.length,
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
