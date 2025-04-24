const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

exports.protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }
  } catch (error) {
    next(error)
  }
}
