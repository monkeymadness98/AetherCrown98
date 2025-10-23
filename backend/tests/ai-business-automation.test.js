/**
 * Tests for AI Business Automation Services
 */

const AIBusinessAutomation = require('../../ai-business-automation');

describe('AIBusinessAutomation', () => {
  let aiAutomation;

  beforeEach(() => {
    aiAutomation = new AIBusinessAutomation();
  });

  describe('initialization', () => {
    test('should create instance with all services', () => {
      expect(aiAutomation).toBeDefined();
      expect(aiAutomation.services).toBeDefined();
      expect(aiAutomation.services.customerService).toBeDefined();
      expect(aiAutomation.services.marketing).toBeDefined();
      expect(aiAutomation.services.operations).toBeDefined();
    });

    test('should have getAvailableServices method', () => {
      const services = aiAutomation.getAvailableServices();
      expect(services.services).toEqual(['customerService', 'marketing', 'operations']);
      expect(services.taskTypes).toContain('customer_inquiry');
      expect(services.taskTypes).toContain('marketing_campaign');
      expect(services.taskTypes).toContain('operational_automation');
    });
  });

  describe('processBusinessTask', () => {
    test('should process customer inquiry', async () => {
      const result = await aiAutomation.processBusinessTask('customer_inquiry', {
        message: 'I need help with my order'
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('customer_inquiry');
      expect(result.status).toBe('processed');
      expect(result.timestamp).toBeDefined();
    });

    test('should process marketing campaign', async () => {
      const result = await aiAutomation.processBusinessTask('marketing_campaign', {
        campaignName: 'Summer Sale',
        target: 'millennials'
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('marketing_campaign');
      expect(result.status).toBe('created');
      expect(result.campaign).toBeDefined();
      expect(result.campaign.name).toBe('Summer Sale');
      expect(result.campaign.target).toBe('millennials');
    });

    test('should process operational automation', async () => {
      const result = await aiAutomation.processBusinessTask('operational_automation', {
        taskName: 'Invoice Processing'
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('operational_automation');
      expect(result.automation).toBeDefined();
      expect(result.automation.status).toBe('automated');
    });

    test('should throw error for unknown task type', async () => {
      await expect(
        aiAutomation.processBusinessTask('unknown_task', {})
      ).rejects.toThrow('Unknown task type: unknown_task');
    });
  });

  describe('CustomerServiceAI', () => {
    test('should handle inquiry with message', async () => {
      const result = await aiAutomation.services.customerService.handleInquiry({
        message: 'What are your business hours?'
      });

      expect(result.response).toContain('What are your business hours?');
      expect(result.timestamp).toBeDefined();
    });

    test('should handle inquiry with query', async () => {
      const result = await aiAutomation.services.customerService.handleInquiry({
        query: 'Refund policy'
      });

      expect(result.response).toContain('Refund policy');
    });
  });

  describe('MarketingAI', () => {
    test('should create campaign with default values', async () => {
      const result = await aiAutomation.services.marketing.createCampaign({});

      expect(result.campaign.name).toBe('AI Generated Campaign');
      expect(result.campaign.target).toBe('general audience');
      expect(result.campaign.estimatedReach).toBeGreaterThan(0);
    });

    test('should create campaign with custom values', async () => {
      const result = await aiAutomation.services.marketing.createCampaign({
        campaignName: 'Black Friday',
        target: 'tech enthusiasts'
      });

      expect(result.campaign.name).toBe('Black Friday');
      expect(result.campaign.target).toBe('tech enthusiasts');
    });
  });

  describe('OperationsAI', () => {
    test('should automate task with default values', async () => {
      const result = await aiAutomation.services.operations.automateTask({});

      expect(result.task).toBe('Automated task');
      expect(result.automation.efficiency).toBe('95%');
    });

    test('should automate task with custom task name', async () => {
      const result = await aiAutomation.services.operations.automateTask({
        taskName: 'Email Categorization'
      });

      expect(result.task).toBe('Email Categorization');
      expect(result.automation.timeSaved).toBe('4.5 hours/week');
    });
  });
});
