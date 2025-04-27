const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require("../middleware/auth.middleware")

const router = express.Router();
router.use(protect)

router.get('/', analyticsController.getAnalytics);

router.get("/get-yearly-logs-overview", analyticsController.getYearlyLogs);

router.get("/get-monthly-logs-overview", analyticsController.getMonthlyLogs);

router.get('/get-top-endpoints', analyticsController.getTopEndpoints);

router.get('/get-status-code-distribution', analyticsController.getStatusCodeDistribution);

router.get('/get-method-distribution', analyticsController.getMethodDistribution);

router.get('/get-overview', analyticsController.overview);

router.get('/get-last-three-mins-logs', analyticsController.getRecentLogs);

module.exports = router;
