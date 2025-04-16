const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  workspace:  { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  key:        { type: String, required: true, unique: true },
  createdAt:  { type: Date, default: Date.now },
  expiresAt:  { type: Date },     
  revoked:    { type: Boolean, default: false },
  lastUsed:   { type: Date }    
});

module.exports = mongoose.model('APIKey', apiKeySchema);
