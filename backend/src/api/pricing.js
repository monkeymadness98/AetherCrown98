const express = require('express');
const DynamicPricingService = require('../services/dynamic-pricing');

const router = express.Router();
const pricingService = new DynamicPricingService();

/**
 * Get dynamic price for a product
 */
router.get('/calculate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const price = await pricingService.calculateDynamicPrice(productId);
    res.json({ productId, price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update pricing based on supply/demand
 */
router.post('/update', async (req, res) => {
  try {
    const result = await pricingService.updateAllPrices();
    res.json({ success: true, updated: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get pricing insights and recommendations
 */
router.get('/insights/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const insights = await pricingService.getPricingInsights(productId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
