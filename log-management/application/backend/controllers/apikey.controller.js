const APIKey = require("../models/APIKey.model")
const Workspace = require("../models/Workspace.model")
const { generateApiKey, decodeApiKey } = require("../utils/apikey.utils")

exports.generateApiKey = async (req, res, next) => {
  try {
    const { workspaceId } = req.params


    const workspace = await Workspace.findOne({
      _id: workspaceId,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or not authorized",
      })
    }

    const apiKeyValue = generateApiKey(req.user._id, workspaceId)

    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    const apiKey = await APIKey.create({
      workspace: workspaceId,
      key: apiKeyValue,
      expiresAt: expiryDate,
    })

    res.status(201).json({
      success: true,
      data: {
        key: apiKeyValue,
        expiresAt: apiKey.expiresAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getApiKeys = async (req, res, next) => {
  try {
    const { workspaceId } = req.params

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or not authorized",
      })
    }

    const apiKeys = await APIKey.find({
      workspace: workspaceId,
      revoked: false,
    }).select("key createdAt expiresAt lastUsed")

    res.status(200).json({
      success: true,
      count: apiKeys.length,
      data: apiKeys,
    })
  } catch (error) {
    next(error)
  }
}

exports.revokeApiKey = async (req, res, next) => {
  try {
    const { id } = req.params

    const apiKey = await APIKey.findById(id)

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API key not found",
      })
    }

    const workspace = await Workspace.findOne({
      _id: apiKey.workspace,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Not authorized to revoke this API key",
      })
    }

    apiKey.revoked = true
    await apiKey.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

exports.validateApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.body

    if (!apiKey) {
      return res.status(400).json({
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

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        workspaceId: decoded.workspaceId,
        userId: decoded.userId,
      },
    })
  } catch (error) {
    next(error)
  }
}
