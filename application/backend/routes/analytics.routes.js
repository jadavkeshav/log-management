const express = require("express")
const { addAnalytics, getAnalytics, getAnalyticsSummary } = require("../controllers/analytics.controller")
const { protect } = require("../middleware/auth.middleware")
const { validateApiKey } = require("../middleware/apikey.middleware")

const router = express.Router()

router.post("/", validateApiKey, addAnalytics)

router.get("/:workspaceId", protect, getAnalytics)
router.get("/:workspaceId/summary", protect, getAnalyticsSummary)

module.exports = router
