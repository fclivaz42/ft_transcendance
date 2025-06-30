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
	let data: string | Buffer | undefined = undefined;
	try {
		data = fs.readFileSync(filePath);
	} catch (err) {
		Logger.warn(`File not found: ${filePath}`);
	}
	if (!data) {
		data = fs.readFileSync(path.join(staticPath, 'index.html'));
		if (!data) {
			reply.code(404).send('File not found');
			Logger.error(`Failed to serve file: ${filePath}`);
			return;
		}
		Logger.warn(`Serving default index.html for missing file: ${filePath}`);
		reply.code(404).type('text/html').send(data);
		return;
	}
	return reply.headers({
	}).type(getMimeType(filePath)).send(data);
}

export default async function frontendRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/*', async (request, reply) => {
		serveFront(request, reply);
  });

	fastify.get('/pong', async (request, reply) => {
		serveFront(request, reply);
	});

	fastify.get('/history', async (request, reply) => {
		serveFront(request, reply);
	});

	fastify.get('/user', async (request, reply) => {
		serveFront(request, reply);
	});
}
