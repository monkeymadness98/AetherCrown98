const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get dashboard KPIs
   */
  async getDashboardKPIs(timeframe = '30d') {
    try {
      const days = parseInt(timeframe) || 30;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Get revenue data
      const { data: revenue } = await supabase
        .from('revenue_daily')
        .select('revenue')
        .gte('date', startDate);

      const totalRevenue = revenue?.reduce((sum, r) => sum + r.revenue, 0) || 0;
      const avgDailyRevenue = totalRevenue / days;

      // Get user data
      const { data: users } = await supabase
        .from('users')
        .select('id, created_at')
        .gte('created_at', startDate);

      const newUsers = users?.length || 0;

      // Get conversion data
      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .gte('timestamp', startDate);

      const totalConversions = conversions?.length || 0;

      // Get traffic data
      const { data: traffic } = await supabase
        .from('page_views')
        .select('count')
        .gte('timestamp', startDate);

      const totalViews = traffic?.reduce((sum, t) => sum + (t.count || 0), 0) || 0;
      const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

      // Get order data
      const { data: orders } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', startDate);

      const totalOrders = orders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth rates
      const prevPeriodStart = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);
      const { data: prevRevenue } = await supabase
        .from('revenue_daily')
        .select('revenue')
        .gte('date', prevPeriodStart)
        .lt('date', startDate);

      const prevTotalRevenue = prevRevenue?.reduce((sum, r) => sum + r.revenue, 0) || 0;
      const revenueGrowth = prevTotalRevenue > 0 
        ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
        : 0;

      logger.info(`Generated dashboard KPIs for ${days} days`);

      return {
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          daily: Math.round(avgDailyRevenue * 100) / 100,
          growth: Math.round(revenueGrowth * 100) / 100
        },
        users: {
          new: newUsers,
          growth: 0 // Calculate based on previous period
        },
        conversions: {
          total: totalConversions,
          rate: Math.round(conversionRate * 100) / 100
        },
        orders: {
          total: totalOrders,
          avgValue: Math.round(avgOrderValue * 100) / 100
        },
        traffic: {
          total: totalViews,
          avgDaily: Math.round(totalViews / days)
        },
        timeframe: `${days}d`
      };
    } catch (error) {
      logger.error(`Error getting dashboard KPIs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get traffic analytics
   */
  async getTrafficAnalytics(timeframe = '30d') {
    try {
      const days = parseInt(timeframe) || 30;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const { data: traffic } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', startDate)
        .order('timestamp', { ascending: true });

      // Aggregate by day
      const dailyTraffic = {};
      traffic?.forEach(view => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        if (!dailyTraffic[date]) {
          dailyTraffic[date] = {
            date,
            views: 0,
            uniqueVisitors: new Set(),
            bounceRate: 0,
            avgTimeOnSite: 0
          };
        }
        dailyTraffic[date].views += view.count || 1;
        if (view.user_id) {
          dailyTraffic[date].uniqueVisitors.add(view.user_id);
        }
      });

      // Convert to array and calculate metrics
      const trafficData = Object.values(dailyTraffic).map(day => ({
        date: day.date,
        views: day.views,
        uniqueVisitors: day.uniqueVisitors.size,
        bounceRate: Math.round(Math.random() * 30 + 40), // Mock data
        avgTimeOnSite: Math.round(Math.random() * 180 + 120) // Mock data in seconds
      }));

      // Get top pages
      const { data: topPages } = await supabase
        .from('page_views')
        .select('page, count')
        .gte('timestamp', startDate);

      const pageViews = {};
      topPages?.forEach(view => {
        pageViews[view.page] = (pageViews[view.page] || 0) + (view.count || 1);
      });

      const topPagesList = Object.entries(pageViews)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      logger.info(`Generated traffic analytics for ${days} days`);

      return {
        daily: trafficData,
        topPages: topPagesList,
        summary: {
          totalViews: trafficData.reduce((sum, d) => sum + d.views, 0),
          totalUniqueVisitors: new Set(traffic?.map(v => v.user_id).filter(Boolean)).size,
          avgBounceRate: Math.round(
            trafficData.reduce((sum, d) => sum + d.bounceRate, 0) / trafficData.length
          )
        }
      };
    } catch (error) {
      logger.error(`Error getting traffic analytics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get conversion metrics
   */
  async getConversionMetrics(timeframe = '30d') {
    try {
      const days = parseInt(timeframe) || 30;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .gte('timestamp', startDate);

      // Group by funnel stage
      const funnelData = {
        'visit': 0,
        'product_view': 0,
        'add_to_cart': 0,
        'checkout': 0,
        'purchase': 0
      };

      conversions?.forEach(conv => {
        if (funnelData.hasOwnProperty(conv.stage)) {
          funnelData[conv.stage]++;
        }
      });

      // Calculate conversion rates between stages
      const funnel = Object.entries(funnelData).map(([stage, count], index, arr) => {
        const nextStage = arr[index + 1];
        const conversionRate = nextStage && count > 0
          ? (nextStage[1] / count) * 100
          : 0;

        return {
          stage,
          count,
          conversionRate: Math.round(conversionRate * 100) / 100
        };
      });

      // Get conversion by source
      const { data: sources } = await supabase
        .from('conversions')
        .select('source')
        .gte('timestamp', startDate);

      const sourceConversions = {};
      sources?.forEach(s => {
        sourceConversions[s.source || 'direct'] = 
          (sourceConversions[s.source || 'direct'] || 0) + 1;
      });

      const conversionsBySource = Object.entries(sourceConversions)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      logger.info(`Generated conversion metrics for ${days} days`);

      return {
        funnel,
        bySource: conversionsBySource,
        summary: {
          totalConversions: conversions?.length || 0,
          overallConversionRate: funnelData.visit > 0
            ? Math.round((funnelData.purchase / funnelData.visit) * 10000) / 100
            : 0
        }
      };
    } catch (error) {
      logger.error(`Error getting conversion metrics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Suggest operational optimizations
   */
  async suggestOptimizations() {
    try {
      const optimizations = [];

      // Analyze pricing efficiency
      const { data: products } = await supabase
        .from('products')
        .select('id, name, current_price, inventory_count, sales_count');

      products?.forEach(product => {
        if (product.inventory_count > 500 && product.sales_count < 10) {
          optimizations.push({
            type: 'pricing',
            priority: 'high',
            product: product.name,
            suggestion: 'Consider reducing price to improve sales velocity',
            impact: 'Reduce inventory holding costs'
          });
        }

        if (product.inventory_count < 20 && product.sales_count > 50) {
          optimizations.push({
            type: 'inventory',
            priority: 'high',
            product: product.name,
            suggestion: 'Reorder stock immediately to avoid stockouts',
            impact: 'Prevent lost sales'
          });
        }
      });

      // Analyze marketing efficiency
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, name, budget, conversions, status')
        .eq('status', 'active');

      campaigns?.forEach(campaign => {
        const costPerConversion = campaign.conversions > 0
          ? campaign.budget / campaign.conversions
          : 0;

        if (costPerConversion > 50) {
          optimizations.push({
            type: 'marketing',
            priority: 'medium',
            campaign: campaign.name,
            suggestion: 'Optimize targeting or reduce budget - high cost per conversion',
            impact: 'Improve marketing ROI'
          });
        }
      });

      // Analyze operational efficiency
      const kpis = await this.getDashboardKPIs('7d');
      
      if (kpis.conversions.rate < 2) {
        optimizations.push({
          type: 'website',
          priority: 'high',
          suggestion: 'Conversion rate is low - consider A/B testing checkout flow',
          impact: 'Increase revenue without additional traffic'
        });
      }

      if (kpis.revenue.growth < 0) {
        optimizations.push({
          type: 'strategy',
          priority: 'critical',
          suggestion: 'Revenue declining - review pricing, marketing, and product strategy',
          impact: 'Reverse negative trend'
        });
      }

      logger.info(`Generated ${optimizations.length} optimization suggestions`);

      return {
        optimizations,
        summary: {
          total: optimizations.length,
          critical: optimizations.filter(o => o.priority === 'critical').length,
          high: optimizations.filter(o => o.priority === 'high').length,
          medium: optimizations.filter(o => o.priority === 'medium').length
        }
      };
    } catch (error) {
      logger.error(`Error suggesting optimizations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get real-time metrics
   */
  async getRealtimeMetrics() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      // Active users
      const { data: activeUsers } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('last_activity', fiveMinutesAgo);

      // Recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false });

      // Current revenue (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { data: recentRevenue } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', oneHourAgo);

      const currentRevenue = recentRevenue?.reduce((sum, o) => sum + o.total, 0) || 0;

      return {
        activeUsers: activeUsers?.length || 0,
        recentOrders: recentOrders?.length || 0,
        currentRevenue: Math.round(currentRevenue * 100) / 100,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error getting realtime metrics: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AnalyticsService;
