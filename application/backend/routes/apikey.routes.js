const express = require("express")
const { generateApiKey, getApiKeys, revokeApiKey, validateApiKey } = require("../controllers/apikey.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

router.use(protect)

router.post("/:workspaceId", generateApiKey)
router.get("/:workspaceId", getApiKeys)
router.delete("/:id", revokeApiKey)

router.post("/validate", validateApiKey)

module.exports = router
