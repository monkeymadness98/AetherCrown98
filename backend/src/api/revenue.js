const express = require('express');
const RevenueModelService = require('../services/revenue-model');

const router = express.Router();
const revenueService = new RevenueModelService();

/**
 * Get revenue predictions
 */
router.get('/predictions', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const predictions = await revenueService.predictRevenue(timeframe);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get revenue breakdown by product/category
 */
router.get('/breakdown', async (req, res) => {
  try {
    const breakdown = await revenueService.getRevenueBreakdown();
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get high-value market predictions
 */
router.get('/markets/predictions', async (req, res) => {
  try {
    const markets = await revenueService.predictHighValueMarkets();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
