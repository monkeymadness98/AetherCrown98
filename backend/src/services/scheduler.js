const cron = require('node-cron');
const logger = require('../utils/logger');
const DynamicPricingService = require('./dynamic-pricing');
const SecurityMonitorService = require('./security-monitor');
const CompetitorAnalysisService = require('./competitor-analysis');

const pricingService = new DynamicPricingService();
const securityService = new SecurityMonitorService();
const competitorService = new CompetitorAnalysisService();

/**
 * Initialize all scheduled jobs
 */
async function initScheduledJobs() {
  logger.info('Initializing scheduled jobs...');

  // Update pricing every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running scheduled pricing update...');
    try {
      await pricingService.updateAllPrices();
    } catch (error) {
      logger.error(`Scheduled pricing update failed: ${error.message}`);
    }
  });

  // Security monitoring every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running security monitoring...');
    try {
      await securityService.detectThreats();
      await securityService.scanVulnerabilities();
    } catch (error) {
      logger.error(`Security monitoring failed: ${error.message}`);
    }
  });

  // API key rotation check daily
  cron.schedule('0 0 * * *', async () => {
    logger.info('Checking for API key rotation...');
    try {
      await securityService.rotateAPIKeys();
    } catch (error) {
      logger.error(`API key rotation failed: ${error.message}`);
    }
  });

  // Competitor analysis weekly
  cron.schedule('0 0 * * 0', async () => {
    logger.info('Running weekly competitor analysis...');
    try {
      await competitorService.detectTrends();
    } catch (error) {
      logger.error(`Competitor analysis failed: ${error.message}`);
    }
  });

  // Auto-correct issues every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    logger.info('Running auto-correction...');
    try {
      await competitorService.autoCorrectIssues();
    } catch (error) {
      logger.error(`Auto-correction failed: ${error.message}`);
    }
  });

  logger.info('All scheduled jobs initialized successfully');
}

module.exports = { initScheduledJobs };
