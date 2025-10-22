import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Analytics
  async getDashboardKPIs(timeframe = '30d') {
    const response = await this.client.get(`/analytics/dashboard/kpis?timeframe=${timeframe}`);
    return response.data;
  }

  async getTrafficAnalytics(timeframe = '30d') {
    const response = await this.client.get(`/analytics/traffic?timeframe=${timeframe}`);
    return response.data;
  }

  async getConversionMetrics(timeframe = '30d') {
    const response = await this.client.get(`/analytics/conversions?timeframe=${timeframe}`);
    return response.data;
  }

  async getOptimizations() {
    const response = await this.client.get('/analytics/optimizations');
    return response.data;
  }

  // Revenue
  async getRevenuePredictions(timeframe = '30d') {
    const response = await this.client.get(`/revenue/predictions?timeframe=${timeframe}`);
    return response.data;
  }

  async getRevenueBreakdown() {
    const response = await this.client.get('/revenue/breakdown');
    return response.data;
  }

  async getHighValueMarkets() {
    const response = await this.client.get('/revenue/markets/predictions');
    return response.data;
  }

  // Products
  async getProducts() {
    const response = await this.client.get('/products');
    return response.data;
  }

  async getProduct(id) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  // Pricing
  async getDynamicPrice(productId) {
    const response = await this.client.get(`/pricing/calculate/${productId}`);
    return response.data;
  }

  async getPricingInsights(productId) {
    const response = await this.client.get(`/pricing/insights/${productId}`);
    return response.data;
  }

  // Marketing
  async generateContent(data) {
    const response = await this.client.post('/marketing/content/generate', data);
    return response.data;
  }

  async getCustomerSegments() {
    const response = await this.client.get('/marketing/segments');
    return response.data;
  }

  async createABTest(data) {
    const response = await this.client.post('/marketing/ab-test/create', data);
    return response.data;
  }

  async getABTestResults(testId) {
    const response = await this.client.get(`/marketing/ab-test/${testId}/results`);
    return response.data;
  }

  // Payments
  async createPayment(data) {
    const response = await this.client.post('/payments/create', data);
    return response.data;
  }

  async createSubscription(data) {
    const response = await this.client.post('/payments/subscription/create', data);
    return response.data;
  }

  async getSupportedCurrencies() {
    const response = await this.client.get('/payments/currencies');
    return response.data;
  }

  // Security
  async getSecurityStatus() {
    const response = await this.client.get('/security/status');
    return response.data;
  }

  async getComplianceStatus() {
    const response = await this.client.get('/security/compliance');
    return response.data;
  }

  // Competitor Analysis
  async getMarketTrends() {
    const response = await this.client.get('/competitor/trends');
    return response.data;
  }

  async getBusinessStrategies() {
    const response = await this.client.get('/competitor/strategies');
    return response.data;
  }

  async getPartnershipSuggestions() {
    const response = await this.client.get('/competitor/partnerships');
    return response.data;
  }
}

export default new ApiService();
