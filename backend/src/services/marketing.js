const axios = require('axios');
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

class MarketingService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  /**
   * Generate marketing content using AI
   */
  async generateContent({ productId, type, platform }) {
    try {
      // Get product details
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) {
        throw new Error('Product not found');
      }

      // Generate content based on type
      const prompt = this.buildContentPrompt(product, type, platform);
      
      const content = await this.callOpenAI(prompt);

      // Store generated content
      await supabase.from('marketing_content').insert({
        product_id: productId,
        type,
        platform,
        content,
        created_at: new Date()
      });

      logger.info(`Generated ${type} content for product ${productId}`);

      return { content, type, platform };
    } catch (error) {
      logger.error(`Error generating content: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build prompt for content generation
   */
  buildContentPrompt(product, type, platform) {
    const baseInfo = `Product: ${product.name}\nDescription: ${product.description}\nPrice: ${product.current_price}`;

    const prompts = {
      'ad-copy': `Create compelling ad copy for ${platform} promoting:\n${baseInfo}\nMake it engaging and conversion-focused.`,
      'email': `Write a marketing email promoting:\n${baseInfo}\nInclude subject line and body.`,
      'social-post': `Create a ${platform} post promoting:\n${baseInfo}\nMake it engaging with relevant hashtags.`,
      'product-description': `Write a detailed product description for:\n${baseInfo}\nHighlight key features and benefits.`
    };

    return prompts[type] || prompts['ad-copy'];
  }

  /**
   * Call OpenAI API for content generation
   */
  async callOpenAI(prompt) {
    try {
      if (!this.openaiApiKey) {
        // Return mock content if API key not set
        return `AI-generated content for: ${prompt.substring(0, 50)}...`;
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a marketing expert creating engaging content.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error(`OpenAI API error: ${error.message}`);
      return `AI-generated content (mock): ${prompt.substring(0, 100)}`;
    }
  }

  /**
   * Create marketing campaign
   */
  async createCampaign(campaignData) {
    try {
      const {
        name,
        type,
        targetSegment,
        budget,
        startDate,
        endDate,
        channels
      } = campaignData;

      const campaign = {
        name,
        type,
        target_segment: targetSegment,
        budget,
        start_date: startDate,
        end_date: endDate,
        channels,
        status: 'active',
        created_at: new Date()
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created campaign: ${name}`);

      return data;
    } catch (error) {
      logger.error(`Error creating campaign: ${error.message}`);
      throw error;
    }
  }

  /**
   * Segment customers based on behavior and demographics
   */
  async segmentCustomers() {
    try {
      const { data: users } = await supabase
        .from('users')
        .select(`
          id,
          created_at,
          country,
          payments (amount, created_at)
        `);

      const segments = {
        'high-value': [],
        'frequent-buyers': [],
        'at-risk': [],
        'new-customers': [],
        'international': []
      };

      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      users?.forEach(user => {
        const totalSpent = user.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const purchaseCount = user.payments?.length || 0;
        const lastPurchase = user.payments?.[0]?.created_at;
        const daysSinceSignup = (now - new Date(user.created_at).getTime()) / (24 * 60 * 60 * 1000);

        // High-value customers
        if (totalSpent > 1000) {
          segments['high-value'].push(user.id);
        }

        // Frequent buyers
        if (purchaseCount >= 5) {
          segments['frequent-buyers'].push(user.id);
        }

        // At-risk (no purchase in 30 days)
        if (lastPurchase && new Date(lastPurchase).getTime() < thirtyDaysAgo) {
          segments['at-risk'].push(user.id);
        }

        // New customers
        if (daysSinceSignup < 7) {
          segments['new-customers'].push(user.id);
        }

        // International customers
        if (user.country && user.country !== 'US') {
          segments['international'].push(user.id);
        }
      });

      logger.info(`Segmented ${users?.length || 0} customers into ${Object.keys(segments).length} segments`);

      return segments;
    } catch (error) {
      logger.error(`Error segmenting customers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create A/B test
   */
  async createABTest(testData) {
    try {
      const {
        name,
        description,
        variantA,
        variantB,
        metric,
        targetUsers
      } = testData;

      const test = {
        name,
        description,
        variant_a: variantA,
        variant_b: variantB,
        metric,
        target_users: targetUsers,
        status: 'active',
        created_at: new Date()
      };

      const { data, error } = await supabase
        .from('ab_tests')
        .insert(test)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created A/B test: ${name}`);

      return data;
    } catch (error) {
      logger.error(`Error creating A/B test: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get A/B test results
   */
  async getABTestResults(testId) {
    try {
      const { data: test } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (!test) {
        throw new Error('A/B test not found');
      }

      // Get results for both variants
      const { data: results } = await supabase
        .from('ab_test_results')
        .select('*')
        .eq('test_id', testId);

      const variantAResults = results?.filter(r => r.variant === 'A') || [];
      const variantBResults = results?.filter(r => r.variant === 'B') || [];

      const variantAMetric = this.calculateMetric(variantAResults, test.metric);
      const variantBMetric = this.calculateMetric(variantBResults, test.metric);

      const winner = variantAMetric > variantBMetric ? 'A' : 'B';
      const improvement = Math.abs((variantBMetric - variantAMetric) / variantAMetric * 100);

      logger.info(`A/B test ${testId} results: Winner is variant ${winner}`);

      return {
        testId,
        name: test.name,
        variantA: {
          value: variantAMetric,
          sampleSize: variantAResults.length
        },
        variantB: {
          value: variantBMetric,
          sampleSize: variantBResults.length
        },
        winner,
        improvement: Math.round(improvement * 100) / 100,
        status: test.status
      };
    } catch (error) {
      logger.error(`Error getting A/B test results: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate metric for A/B test variant
   */
  calculateMetric(results, metric) {
    if (results.length === 0) return 0;

    switch (metric) {
      case 'conversion_rate':
        const conversions = results.filter(r => r.converted).length;
        return conversions / results.length;
      case 'revenue':
        return results.reduce((sum, r) => sum + (r.revenue || 0), 0) / results.length;
      case 'engagement':
        return results.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / results.length;
      default:
        return 0;
    }
  }
}

module.exports = MarketingService;
