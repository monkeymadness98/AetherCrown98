/**
 * Tests for AI Automation Server
 */

const request = require('supertest');
const app = require('../../server');

describe('AI Automation Server', () => {
  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('AI Automation Empire');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.length).toBeGreaterThan(0);
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('AI System Operational');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
      expect(response.body.environment.nodeEnv).toBeDefined();
      expect(typeof response.body.environment.hasOpenAIKey).toBe('boolean');
      expect(typeof response.body.environment.hasDatabaseUrl).toBe('boolean');
    });

    test('should return valid timestamp format', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('POST /api/ai-process', () => {
    test('should process AI request successfully', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .send({
          input: 'Test input',
          action: 'test'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.business).toBe('AI Automation Empire');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.input).toBe('Test input');
      expect(response.body.data.action).toBe('test');
    });

    test('should return error for missing input', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .send({
          action: 'test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Input and action are required');
    });

    test('should return error for missing action', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .send({
          input: 'Test input'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Input and action are required');
    });

    test('should return error for empty request', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should include timestamp in response', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .send({
          input: 'Test',
          action: 'process'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.timestamp).toBeDefined();
      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('Error handling', () => {
    test('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/ai-process')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      // Express body-parser returns 400 for invalid JSON, but it goes through error handler
      expect([400, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('CORS', () => {
    test('should include CORS headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
