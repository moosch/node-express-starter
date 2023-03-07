import request from 'supertest';
import app from '../app';

describe('unknownRoute', () => {
  it('should have catch-all in "unknown" routes', async () => {
    const res = await request(app).get("/blah");
    expect(res.status).toEqual(404);
  });

  it('should return for ping/pong and health-check routes', async () => {
    const ping = await request(app).get("/ping");
    const healthCheck = await request(app).get("/health-check");
    expect(ping.status).toEqual(200);
    expect(healthCheck.status).toEqual(200);;
  });
});
