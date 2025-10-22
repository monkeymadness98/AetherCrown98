const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

class DynamicPricingService {
  constructor() {
    this.baseMargin = 0.3; // 30% base margin
    this.demandWeight = 0.4;
    this.supplyWeight = 0.3;
    this.behaviorWeight = 0.3;
  }

  /**
   * Calculate dynamic price based on supply, demand, and user behavior
   */
  async calculateDynamicPrice(productId) {
    try {
      // Fetch product data
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Get demand metrics
      const demandFactor = await this.calculateDemandFactor(productId);
      
      // Get supply metrics
      const supplyFactor = await this.calculateSupplyFactor(productId);
      
      // Get user behavior factor
      const behaviorFactor = await this.calculateBehaviorFactor(productId);

      // Calculate adjusted price
      const baseCost = product.base_cost || product.base_price * 0.7;
      const adjustmentMultiplier = 1 + 
        (demandFactor * this.demandWeight) +
        (supplyFactor * this.supplyWeight) +
        (behaviorFactor * this.behaviorWeight);

      const dynamicPrice = baseCost * (1 + this.baseMargin) * adjustmentMultiplier;
      
      // Update product price
      await supabase
        .from('products')
        .update({ 
          current_price: dynamicPrice,
          last_price_update: new Date(),
          pricing_factors: {
            demand: demandFactor,
            supply: supplyFactor,
            behavior: behaviorFactor
          }
        })
        .eq('id', productId);

      logger.info(`Updated price for product ${productId}: ${dynamicPrice}`);
      
      return dynamicPrice;
    } catch (error) {
      logger.error(`Error calculating dynamic price: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate demand factor based on recent sales and views
   */
  async calculateDemandFactor(productId) {
    try {
      const { data: metrics } = await supabase
        .from('product_metrics')
        .select('views, sales, cart_adds')
        .eq('product_id', productId)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .order('timestamp', { ascending: false });

      if (!metrics || metrics.length === 0) return 0;

      const totalViews = metrics.reduce((sum, m) => sum + (m.views || 0), 0);
      const totalSales = metrics.reduce((sum, m) => sum + (m.sales || 0), 0);
      const conversionRate = totalViews > 0 ? totalSales / totalViews : 0;

      // High conversion rate = high demand = price increase
      return conversionRate > 0.05 ? 0.2 : conversionRate > 0.02 ? 0.1 : -0.1;
    } catch (error) {
      logger.error(`Error calculating demand factor: ${error.message}`);
      return 0;
    }
  }

  /**
   * Calculate supply factor based on inventory levels
   */
  async calculateSupplyFactor(productId) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('inventory_count, reorder_point')
        .eq('id', productId)
        .single();

      if (!product) return 0;

      const inventoryRatio = product.inventory_count / (product.reorder_point || 100);

      // Low inventory = price increase
      if (inventoryRatio < 0.2) return 0.3;
      if (inventoryRatio < 0.5) return 0.1;
      if (inventoryRatio > 2) return -0.2;
      return 0;
    } catch (error) {
      logger.error(`Error calculating supply factor: ${error.message}`);
      return 0;
    }
  }

  /**
   * Calculate behavior factor based on user engagement patterns
   */
  async calculateBehaviorFactor(productId) {
    try {
      const { data: behavior } = await supabase
        .from('user_behavior')
        .select('action, timestamp')
        .eq('product_id', productId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000));

      if (!behavior || behavior.length === 0) return 0;

      const recentInterest = behavior.length / 100; // Normalize
      return Math.min(recentInterest, 0.2); // Cap at 20% increase
    } catch (error) {
      logger.error(`Error calculating behavior factor: ${error.message}`);
      return 0;
    }
  }

  /**
   * Update all product prices
   */
  async updateAllPrices() {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id');

      const updates = [];
      for (const product of products || []) {
        const price = await this.calculateDynamicPrice(product.id);
        updates.push({ id: product.id, price });
      }

      logger.info(`Updated prices for ${updates.length} products`);
      return updates;
    } catch (error) {
      logger.error(`Error updating all prices: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get pricing insights for a product
   */
  async getPricingInsights(productId) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      const demandFactor = await this.calculateDemandFactor(productId);
      const supplyFactor = await this.calculateSupplyFactor(productId);
      const behaviorFactor = await this.calculateBehaviorFactor(productId);

      return {
        productId,
        currentPrice: product.current_price,
        basePrice: product.base_price,
        factors: {
          demand: { value: demandFactor, impact: 'medium' },
          supply: { value: supplyFactor, impact: 'medium' },
          behavior: { value: behaviorFactor, impact: 'low' }
        },
        recommendation: demandFactor > 0.1 ? 'increase' : demandFactor < -0.1 ? 'decrease' : 'maintain'
      };
    } catch (error) {
      logger.error(`Error getting pricing insights: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DynamicPricingService;
