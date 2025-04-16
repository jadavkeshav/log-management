const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workspace', workspaceSchema);
