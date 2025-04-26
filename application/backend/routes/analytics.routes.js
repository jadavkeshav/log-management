const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require("../middleware/auth.middleware")

const router = express.Router();
router.use(protect)

router.get('/', analyticsController.getAnalytics);

module.exports = router;
