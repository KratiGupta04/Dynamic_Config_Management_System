const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  environment: { type: String, required: true, enum: ['global', 'dev', 'prod'] },
  version: { type: String, default: '1.0.0' },
  data: { type: Object, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure unique combination of clientId, environment, and version
ConfigSchema.index({ clientId: 1, environment: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Config', ConfigSchema);
