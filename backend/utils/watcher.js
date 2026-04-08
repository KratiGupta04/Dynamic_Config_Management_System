const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const Config = require('../models/Config');

const watchConfigs = (io) => {
         const configDir = path.resolve(__dirname, '../../configs');

         if (!fs.existsSync(configDir)) {
                  fs.mkdirSync(configDir);
         }

         const watcher = chokidar.watch(configDir, {
                  persistent: true,
                  ignoreInitial: true
         });

         watcher.on('change', async (filePath) => {
                  console.log(`File ${filePath} has been changed`);
                  try {
                           const fileName = path.basename(filePath);
                           // Expected format: clientId_environment_version.json
                           // e.g., global_global_1.0.0.json, clientA_dev_1.0.0.json
                           const parts = fileName.replace('.json', '').split('_');

                           if (parts.length !== 3) {
                                    console.error(`Invalid file name format: ${fileName}. Expected: clientId_environment_version.json`);
                                    return;
                           }

                           const [clientId, environment, version] = parts;
                           const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                           const config = await Config.findOneAndUpdate(
                                    { clientId, environment, version },
                                    { data, lastUpdated: Date.now() },
                                    { upsert: true, new: true }
                           );

                           console.log(`Updated database from file: ${fileName}`);
                           io.emit('configUpdated', { clientId, environment, version });
                  } catch (error) {
                           console.error(`Error processing file change: ${error.message}`);
                  }
         });

         console.log(`Watching for config changes in: ${configDir}`);
};

module.exports = watchConfigs;
