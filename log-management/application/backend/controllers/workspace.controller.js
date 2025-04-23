const Workspace = require("../models/Workspace.model")
const User = require("../models/User.model")
const { generateApiKey } = require("../utils/apikey.utils")
const APIKey = require("../models/APIKey.model")

exports.createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const userId = req.user._id

    const workspaceCount = await Workspace.countDocuments({ user: userId })

    if (workspaceCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "You have reached the maximum limit of 5 workspaces",
      })
    }

    const workspace = await Workspace.create({
      name,
      description,
      user: userId,
    })

    const apiKeyValue = generateApiKey(userId, workspace._id)

    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1) // API key valid for 1 year

    await APIKey.create({
      workspace: workspace._id,
      key: apiKeyValue,
      expiresAt: expiryDate,
    })

    await User.findByIdAndUpdate(userId, { $push: { workspaces: workspace._id } })

    res.status(201).json({
      success: true,
      data: workspace,
      apiKey: apiKeyValue,
    })
  } catch (error) {
    next(error)
  }
}

exports.getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ user: req.user._id })

    res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    })
  } catch (error) {
    next(error)
  }
}

exports.getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      })
    }

    res.status(200).json({
      success: true,
      data: workspace,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body

    let workspace = await Workspace.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      })
    }

    workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      data: workspace,
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      })
    }

    await workspace.remove()

    await User.findByIdAndUpdate(req.user._id, { $pull: { workspaces: req.params.id } })

    await APIKey.updateMany({ workspace: req.params.id }, { revoked: true })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
