const Analytics = require("../models/Analytics.model")
const Workspace = require("../models/Workspace.model")
const mongoose = require("mongoose")

exports.addAnalytics = async (req, res, next) => {
  try {
    const { type, payload, source } = req.body
    const workspaceId = req.workspace

    const analytics = await Analytics.create({
      workspace: workspaceId,
      type,
      payload,
      source,
      timestamp: new Date(),
    })

    res.status(201).json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAnalytics = async (req, res, next) => {
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

    const { type, startDate, endDate, limit = 100, page = 1 } = req.query

    const query = { workspace: workspaceId }

    if (type) {
      query.type = type
    }

    if (startDate || endDate) {
      query.timestamp = {}

      if (startDate) {
        query.timestamp.$gte = new Date(startDate)
      }

      if (endDate) {
        query.timestamp.$lte = new Date(endDate)
      }
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get analytics
    const analytics = await Analytics.find(query).sort({ timestamp: -1 }).skip(skip).limit(Number.parseInt(limit))

    // Get total count
    const total = await Analytics.countDocuments(query)

    res.status(200).json({
      success: true,
      count: analytics.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAnalyticsSummary = async (req, res, next) => {
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

    const typeCount = await Analytics.aggregate([
      { $match: { workspace: mongoose.Types.ObjectId(workspaceId) } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ])

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyCount = await Analytics.aggregate([
      {
        $match: {
          workspace: mongoose.Types.ObjectId(workspaceId),
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        byType: typeCount,
        byDay: dailyCount,
      },
    })
  } catch (error) {
    next(error)
  }
}
