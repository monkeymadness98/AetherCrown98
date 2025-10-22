const express = require('express');
const pricingRoutes = require('./pricing');
const revenueRoutes = require('./revenue');
const paymentsRoutes = require('./payments');
const analyticsRoutes = require('./analytics');
const marketingRoutes = require('./marketing');
const productsRoutes = require('./products');
const securityRoutes = require('./security');
const competitorRoutes = require('./competitor');

const router = express.Router();

router.use('/pricing', pricingRoutes);
router.use('/revenue', revenueRoutes);
router.use('/payments', paymentsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/marketing', marketingRoutes);
router.use('/products', productsRoutes);
router.use('/security', securityRoutes);
router.use('/competitor', competitorRoutes);

module.exports = router;
