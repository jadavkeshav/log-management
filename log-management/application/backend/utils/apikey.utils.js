const jwt = require("jsonwebtoken")
const crypto = require("crypto")

exports.generateApiKey = (userId, workspaceId) => {
  const payload = {
    userId,
    workspaceId,
    createdAt: new Date().toISOString(),
  }

  const token = jwt.sign(payload, process.env.API_KEY_SECRET, {
    expiresIn: "1y", // 1 year
  })

  const prefix = crypto.randomBytes(4).toString("hex")

  return `${prefix}.${token}`
}


exports.decodeApiKey = (apiKey) => {
  try {
    const parts = apiKey.split(".")

    const token = parts.slice(1).join(".")

    const decoded = jwt.verify(token, process.env.API_KEY_SECRET)

    return decoded
  } catch (error) {
    console.error("API key decode error:", error.message)
    return null
  }
}
