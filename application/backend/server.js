const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const { setupWebSocket } = require("./sockets/ws.controller")

dotenv.config()

const authRoutes = require("./routes/auth.routes")
const workspaceRoutes = require("./routes/workspace.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const apikeyRoutes = require("./routes/apikey.routes")

const app = express()
const server = http.createServer(app) 

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/workspaces", workspaceRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/apikeys", apikeyRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    const PORT = process.env.PORT || 5000
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      setupWebSocket(server) 
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })
