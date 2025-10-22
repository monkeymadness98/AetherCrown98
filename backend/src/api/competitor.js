const express = require('express');
const CompetitorAnalysisService = require('../services/competitor-analysis');

const router = express.Router();
const competitorService = new CompetitorAnalysisService();

/**
 * Analyze competitors
 */
router.post('/analyze', async (req, res) => {
  try {
    const { competitors } = req.body;
    const analysis = await competitorService.analyzeCompetitors(competitors);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Detect market trends
 */
router.get('/trends', async (req, res) => {
  try {
    const trends = await competitorService.detectTrends();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate business strategies
 */
router.get('/strategies', async (req, res) => {
  try {
    const strategies = await competitorService.generateStrategies();
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Suggest partnerships
 */
router.get('/partnerships', async (req, res) => {
  try {
    const partnerships = await competitorService.suggestPartnerships();
    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
