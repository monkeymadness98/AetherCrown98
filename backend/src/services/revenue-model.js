const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

class RevenueModelService {
  constructor() {
    this.historicalDataDays = 90;
  }

  /**
   * Predict revenue using time series analysis
   */
  async predictRevenue(timeframe = '30d') {
    try {
      const days = parseInt(timeframe) || 30;
      
      // Get historical revenue data
      const { data: historicalData } = await supabase
        .from('revenue_daily')
        .select('*')
        .gte('date', new Date(Date.now() - this.historicalDataDays * 24 * 60 * 60 * 1000))
        .order('date', { ascending: true });

      if (!historicalData || historicalData.length < 7) {
        throw new Error('Insufficient historical data for predictions');
      }

      // Calculate trends
      const trend = this.calculateTrend(historicalData);
      const seasonality = this.calculateSeasonality(historicalData);
      const growth = this.calculateGrowthRate(historicalData);

      // Generate predictions
      const predictions = [];
      const lastRevenue = historicalData[historicalData.length - 1].revenue;
      
      for (let day = 1; day <= days; day++) {
        const prediction = lastRevenue * 
          (1 + growth) ** day * 
          (1 + trend * 0.01) *
          (1 + seasonality[day % 7] * 0.1);
        
        predictions.push({
          date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
          predicted_revenue: Math.round(prediction * 100) / 100,
          confidence: Math.max(0.5, 1 - (day / days) * 0.3)
        });
      }

      // Store predictions
      await supabase
        .from('revenue_predictions')
        .upsert(predictions.map(p => ({
          ...p,
          created_at: new Date(),
          timeframe: timeframe
        })));

      logger.info(`Generated ${predictions.length} revenue predictions`);

      return {
        predictions,
        summary: {
          totalPredicted: predictions.reduce((sum, p) => sum + p.predicted_revenue, 0),
          avgDailyRevenue: predictions.reduce((sum, p) => sum + p.predicted_revenue, 0) / predictions.length,
          growthRate: growth,
          trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
        }
      };
    } catch (error) {
      logger.error(`Error predicting revenue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate trend from historical data
   */
  calculateTrend(data) {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.revenue, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.revenue, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgRevenue = sumY / n;

    return avgRevenue > 0 ? (slope / avgRevenue) * 100 : 0;
  }

  /**
   * Calculate seasonality patterns (day of week)
   */
  calculateSeasonality(data) {
    const dayRevenue = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    data.forEach(d => {
      const dayOfWeek = new Date(d.date).getDay();
      dayRevenue[dayOfWeek] += d.revenue;
      dayCounts[dayOfWeek]++;
    });

    const avgRevenue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;

    return dayRevenue.map((rev, i) => {
      const avgForDay = dayCounts[i] > 0 ? rev / dayCounts[i] : avgRevenue;
      return avgRevenue > 0 ? (avgForDay - avgRevenue) / avgRevenue : 0;
    });
  }

  /**
   * Calculate growth rate
   */
  calculateGrowthRate(data) {
    if (data.length < 14) return 0;

    const recentAvg = data.slice(-7).reduce((sum, d) => sum + d.revenue, 0) / 7;
    const previousAvg = data.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0) / 7;

    return previousAvg > 0 ? (recentAvg - previousAvg) / previousAvg : 0;
  }

  /**
   * Get revenue breakdown by product and category
   */
  async getRevenueBreakdown() {
    try {
      const { data: breakdown } = await supabase
        .from('revenue_breakdown')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

      const byProduct = {};
      const byCategory = {};

      breakdown?.forEach(item => {
        byProduct[item.product_id] = (byProduct[item.product_id] || 0) + item.revenue;
        byCategory[item.category] = (byCategory[item.category] || 0) + item.revenue;
      });

      return {
        byProduct: Object.entries(byProduct)
          .map(([id, revenue]) => ({ productId: id, revenue }))
          .sort((a, b) => b.revenue - a.revenue),
        byCategory: Object.entries(byCategory)
          .map(([category, revenue]) => ({ category, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
      };
    } catch (error) {
      logger.error(`Error getting revenue breakdown: ${error.message}`);
      throw error;
    }
  }

  /**
   * Predict high-value markets based on country-level metrics
   */
  async predictHighValueMarkets() {
    try {
      const { data: marketData } = await supabase
        .from('country_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

      const marketScores = {};

      marketData?.forEach(metric => {
        if (!marketScores[metric.country]) {
          marketScores[metric.country] = {
            country: metric.country,
            revenue: 0,
            users: 0,
            conversions: 0,
            avgOrderValue: 0
          };
        }

        marketScores[metric.country].revenue += metric.revenue || 0;
        marketScores[metric.country].users += metric.users || 0;
        marketScores[metric.country].conversions += metric.conversions || 0;
      });

      // Calculate scores and rank markets
      const markets = Object.values(marketScores).map(market => {
        const avgOrderValue = market.conversions > 0 ? market.revenue / market.conversions : 0;
        const conversionRate = market.users > 0 ? market.conversions / market.users : 0;
        const score = market.revenue * 0.4 + avgOrderValue * 0.3 + conversionRate * 100 * 0.3;

        return {
          ...market,
          avgOrderValue,
          conversionRate,
          score,
          potential: score > 1000 ? 'high' : score > 500 ? 'medium' : 'low'
        };
      }).sort((a, b) => b.score - a.score);

      logger.info(`Analyzed ${markets.length} markets for potential`);

      return markets;
    } catch (error) {
      logger.error(`Error predicting high-value markets: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RevenueModelService;
