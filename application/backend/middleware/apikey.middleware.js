const jwt = require("jsonwebtoken")
const APIKey = require("../models/APIKey.model")
const { decodeApiKey } = require("../utils/apikey.utils")

exports.validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"]

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key is required",
      })
    }

    const decoded = decodeApiKey(apiKey)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key",
      })
    }

    const apiKeyDoc = await APIKey.findOne({
      key: apiKey,
      revoked: false,
      workspace: decoded.workspaceId,
    })

    if (!apiKeyDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid or revoked API key",
      })
    }

    if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "API key has expired",
      })
    }

    apiKeyDoc.lastUsed = new Date()
    await apiKeyDoc.save()

    req.workspace = decoded.workspaceId
    req.userId = decoded.userId

    next()
  } catch (error) {
    next(error)
  }
}
