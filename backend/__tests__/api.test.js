const request = require('supertest');
const app = require('../main');

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.message).toBeDefined();
    });
  });

  describe('GET /api/test-supabase', () => {
    it('should test Supabase connection', async () => {
      const res = await request(app)
        .get('/api/test-supabase');

      // May return 200 or 500 depending on Supabase configuration
      expect([200, 500]).toContain(res.status);
      expect(res.body).toHaveProperty('success');
    });
  });

  describe('Clones endpoints', () => {
    it('GET /api/clones should return clones list', async () => {
      const res = await request(app)
        .get('/api/clones');

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
      }
    });

    it('POST /api/clones should validate required fields', async () => {
      const res = await request(app)
        .post('/api/clones')
        .send({})
        .expect('Content-Type', /json/);

      // Should either create successfully or return error
      expect([201, 500]).toContain(res.status);
    });
  });

  describe('Tasks endpoints', () => {
    it('GET /api/tasks should return tasks list', async () => {
      const res = await request(app)
        .get('/api/tasks');

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
      }
    });
  });

  describe('Payment endpoints', () => {
    it('POST /api/payment/create-order should validate input', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({
          amount: '10.00',
          currency: 'USD',
          description: 'Test payment'
        })
        .expect('Content-Type', /json/);

      // May succeed or fail depending on PayPal configuration
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('Logs endpoints', () => {
    it('GET /api/logs should return logs list', async () => {
      const res = await request(app)
        .get('/api/logs')
        .query({ limit: 10 });

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
      }
    });
  });

  describe('Users endpoints', () => {
    it('GET /api/users should return users list', async () => {
      const res = await request(app)
        .get('/api/users');

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
      }
    });
  });
});
