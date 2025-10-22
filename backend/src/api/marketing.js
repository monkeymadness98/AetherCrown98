const express = require('express');
const MarketingService = require('../services/marketing');

const router = express.Router();
const marketingService = new MarketingService();

/**
 * Generate marketing content
 */
router.post('/content/generate', async (req, res) => {
  try {
    const { productId, type, platform } = req.body;
    const content = await marketingService.generateContent({
      productId,
      type,
      platform
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create ad campaign
 */
router.post('/campaigns/create', async (req, res) => {
  try {
    const campaign = await marketingService.createCampaign(req.body);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Segment customers
 */
router.get('/segments', async (req, res) => {
  try {
    const segments = await marketingService.segmentCustomers();
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create A/B test
 */
router.post('/ab-test/create', async (req, res) => {
  try {
    const test = await marketingService.createABTest(req.body);
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get A/B test results
 */
router.get('/ab-test/:testId/results', async (req, res) => {
  try {
    const { testId } = req.params;
    const results = await marketingService.getABTestResults(testId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
