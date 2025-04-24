const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  apiKey: String,
  message: String,
  level: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
