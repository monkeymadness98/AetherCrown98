const express = require('express');
const AnalyticsService = require('../services/analytics');

const router = express.Router();
const analyticsService = new AnalyticsService();

/**
 * Get dashboard KPIs
 */
router.get('/dashboard/kpis', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const kpis = await analyticsService.getDashboardKPIs(timeframe);
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get traffic analytics
 */
router.get('/traffic', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const traffic = await analyticsService.getTrafficAnalytics(timeframe);
    res.json(traffic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get conversion metrics
 */
router.get('/conversions', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const conversions = await analyticsService.getConversionMetrics(timeframe);
    res.json(conversions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get operational optimizations
 */
router.get('/optimizations', async (req, res) => {
  try {
    const optimizations = await analyticsService.suggestOptimizations();
    res.json(optimizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get real-time metrics
 */
router.get('/realtime', async (req, res) => {
  try {
    const metrics = await analyticsService.getRealtimeMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
