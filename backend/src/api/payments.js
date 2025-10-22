const express = require('express');
const PaymentService = require('../services/payment');

const router = express.Router();
const paymentService = new PaymentService();

/**
 * Create one-time payment
 */
router.post('/create', async (req, res) => {
  try {
    const { amount, currency, productId, userId } = req.body;
    const payment = await paymentService.createPayment({
      amount,
      currency,
      productId,
      userId
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create subscription
 */
router.post('/subscription/create', async (req, res) => {
  try {
    const { userId, planId, currency } = req.body;
    const subscription = await paymentService.createSubscription({
      userId,
      planId,
      currency
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel subscription
 */
router.post('/subscription/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const result = await paymentService.cancelSubscription(subscriptionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle webhook from payment provider
 */
router.post('/webhook', async (req, res) => {
  try {
    await paymentService.handleWebhook(req.body, req.headers);
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get supported currencies
 */
router.get('/currencies', async (req, res) => {
  try {
    const currencies = await paymentService.getSupportedCurrencies();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
