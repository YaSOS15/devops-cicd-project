const request = require('supertest');
const app = require('../app');

describe('Tests API', () => {
  test('GET / retourne un message de bienvenue', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Bienvenue sur mon API DevOps!');
  });

  test('GET /health retourne le status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});