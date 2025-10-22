const SecurityMonitorService = require('./security-monitor');
const logger = require('../utils/logger');

const securityService = new SecurityMonitorService();

/**
 * Initialize security monitoring
 */
async function initSecurityMonitoring() {
  logger.info('Initializing security monitoring...');

  try {
    // Initial security scan
    const status = await securityService.getSecurityStatus();
    logger.info(`Initial security status: ${status.overall}`);

    // Check compliance
    const compliance = await securityService.checkCompliance();
    logger.info(`Compliance score: ${compliance.score}%`);

    logger.info('Security monitoring initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize security monitoring: ${error.message}`);
  }
}

module.exports = { initSecurityMonitoring };
