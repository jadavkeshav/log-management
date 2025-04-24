const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  workspace:  { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  type:       { type: String, required: true },
  payload:    { type: mongoose.Schema.Types.Mixed },
  source:     { type: String },
  timestamp:  { type: Date, default: Date.now }
});

analyticsSchema.index({ workspace: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
