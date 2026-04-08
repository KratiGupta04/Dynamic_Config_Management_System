const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const auth = require('../middleware/auth'); // Placeholder middleware

router.get('/', configController.getConfig);
router.get('/all', auth, configController.getAllConfigs);
router.post('/update', auth, configController.updateConfig);

module.exports = router;
