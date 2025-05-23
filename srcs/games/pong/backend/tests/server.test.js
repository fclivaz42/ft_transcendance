
import request from 'supertest';
import app from '../server.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';


beforeAll( async () => {
	await app.listen({ port: 0, host: '0.0.0.0' });
});
afterAll( async () => {
	await app.close();
});

describe('GET /', () => {
	it('should return 200 with status message', async () => {
		const res = await request(app.server).get('/');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
	});
});

describe('GET /test', () => {
	it('should return 200 with test property and \'hello world!\' message', async () => {
		const res = await request(app.server).get('/test');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('test');
	});
});

describe('GET /non-existent', () => {
	it('should throw a 404', async () => {
		const res = await request(app.server).get('/non-existent');
		expect(res.status).toBe(404);
	});
});

describe('GET /game/state', () => {
	it('should return 200 with ball, p1, p2 and wall properties', async () => {
		const res = await request(app.server).get('/game/state');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('ball');
		expect(res.body).toHaveProperty('p1');
		expect(res.body).toHaveProperty('p2');
	})
})

describe('GET /ws/connect', () => {
	it ('should establish a websocket connection', async () => {
		const rest = await request(app.server).get('/ws/connect');
		expect(res.status).toBe(200);
	})
})