const express = require('express');
const SecurityMonitorService = require('../services/security-monitor');

const router = express.Router();
const securityService = new SecurityMonitorService();

/**
 * Get security status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await securityService.getSecurityStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Rotate API keys
 */
router.post('/rotate-keys', async (req, res) => {
  try {
    const result = await securityService.rotateAPIKeys();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get compliance status
 */
router.get('/compliance', async (req, res) => {
  try {
    const compliance = await securityService.checkCompliance();
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get security alerts
 */
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await securityService.getSecurityAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
