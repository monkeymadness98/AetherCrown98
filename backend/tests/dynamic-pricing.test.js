const DynamicPricingService = require('../src/services/dynamic-pricing');

// Mock Supabase
jest.mock('../src/utils/supabase', () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: 'test-product',
        base_price: 100,
        base_cost: 70,
        current_price: 100,
        inventory_count: 100,
        reorder_point: 50
      },
      error: null
    })
  }))
}));

describe('DynamicPricingService', () => {
  let pricingService;

  beforeEach(() => {
    pricingService = new DynamicPricingService();
  });

  test('should calculate dynamic price', async () => {
    const price = await pricingService.calculateDynamicPrice('test-product');
    expect(price).toBeGreaterThan(0);
    expect(typeof price).toBe('number');
  });

  test('should calculate demand factor', async () => {
    const demandFactor = await pricingService.calculateDemandFactor('test-product');
    expect(typeof demandFactor).toBe('number');
  });

  test('should calculate supply factor', async () => {
    const supplyFactor = await pricingService.calculateSupplyFactor('test-product');
    expect(typeof supplyFactor).toBe('number');
  });

  test('should get pricing insights', async () => {
    const insights = await pricingService.getPricingInsights('test-product');
    expect(insights).toHaveProperty('productId');
    expect(insights).toHaveProperty('factors');
    expect(insights).toHaveProperty('recommendation');
  });
});
