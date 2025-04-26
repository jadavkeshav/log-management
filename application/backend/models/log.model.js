const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    apiKey: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    protocol: { type: String, required: true },
    statusCode: { type: Number, required: true },
    bytesSent: { type: String, required: true },
    userAgent: { type: String, required: true },
    url_length: { type: Number, required: true },
    url_depth: { type: Number, required: true },
    num_encoded_chars: { type: Number, required: true },
    num_special_chars: { type: Number, required: true },
}, {
    timestamps: true
});

const LogModel = mongoose.model('Log', logSchema);

module.exports = LogModel;
