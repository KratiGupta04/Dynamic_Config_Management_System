const Config = require('../models/Config');
const deepMerge = require('../utils/merge');

exports.getConfig = async (req, res) => {
         try {
                  const { clientId, environment, version = '1.0.0' } = req.query;

                  // 1. Fetch Global Config
                  const globalConfig = await Config.findOne({ clientId: 'global', environment: 'global', version });

                  let finalConfig = globalConfig ? JSON.parse(JSON.stringify(globalConfig.data)) : {};

                  // 2. Fetch Environment Config (if applicable)
                  if (environment && environment !== 'global') {
                           const envConfig = await Config.findOne({ clientId: 'global', environment, version });
                           if (envConfig) {
                                    finalConfig = deepMerge(finalConfig, envConfig.data);
                           }
                  }

                  // 3. Fetch Client-Specific Config (if applicable)
                  if (clientId && clientId !== 'global' && environment) {
                           const clientConfig = await Config.findOne({ clientId, environment, version });
                           if (clientConfig) {
                                    finalConfig = deepMerge(finalConfig, clientConfig.data);
                           }
                  }

                  res.json(finalConfig);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};

exports.updateConfig = async (req, res) => {
         try {
                  const { clientId, environment, version, data } = req.body;

                  let config = await Config.findOne({ clientId, environment, version });

                  if (config) {
                           config.data = data;
                           config.lastUpdated = Date.now();
                           await config.save();
                  } else {
                           config = new Config({ clientId, environment, version, data });
                           await config.save();
                  }

                  // Notify via Socket.io (will be handled in server.js or via an event emitter)
                  if (req.app.get('socketio')) {
                           req.app.get('socketio').emit('configUpdated', { clientId, environment, version });
                  }

                  res.json(config);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};

exports.getAllConfigs = async (req, res) => {
         try {
                  const configs = await Config.find().sort({ lastUpdated: -1 });
                  res.json(configs);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
