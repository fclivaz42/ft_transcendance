import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import getMimeType from './mimTypes.ts';
import Logger from '../../../../libs/helpers/loggers.ts';

const staticPath = path.join('/var/www/sarif-frontend/');

function serveFront(request: FastifyRequest, reply: FastifyReply) {
	const params = request.params as { '*'?: string };
	let filePath = staticPath;
	if (params['*'])
		filePath = path.join(filePath, params['*']);
	
	if (filePath.endsWith('/'))
		filePath += 'index.html';
	let data: string | undefined;
	try {
		data = fs.readFileSync(filePath, "utf-8");
	} catch (err) {
		Logger.warn(`File not found: ${filePath}`);
	}
	if (!data) {
		reply.code(404).type("text/html").send("<style>body {background-color: black; color: white;}</style><h1>404 Not Found</h1><p>The requested resource could not be found.</p><p>Sarifcore Webserver</p>");
		return;
	}
	return reply.headers({
		'Cache-Control': 'public, max-age=3600, immutable',
	}).type(getMimeType(filePath)).send(data);
}

export default async function frontendRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/*', async (request, reply) => {
		serveFront(request, reply);
  });

	fastify.get('/pong', async (request, reply) => {
		serveFront(request, reply);
	});

	fastify.get('/leaderboard', async (request, reply) => {
		serveFront(request, reply);
	});

	fastify.get('/history', async (request, reply) => {
		serveFront(request, reply);
	});

	fastify.get('/user', async (request, reply) => {
		serveFront(request, reply);
	});
}
