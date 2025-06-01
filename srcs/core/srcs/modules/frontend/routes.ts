import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import getMimeType from './mimTypes.ts';

export default async function frontendRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/*', async (request, reply) => {
    const params = request.params as { '*': string };
    let filePath = path.join('/var/www/sarif-frontend/public/', params['*']);
    if (filePath.endsWith('/'))
      filePath += 'index.html';
    const data = fs.readFileSync(filePath, 'utf8');
    if (!data)
      return reply.code(404).send('Not found');
    return reply.headers({
      'Cache-Control': 'public, max-age=3600, immutable',
    }).type(getMimeType(filePath)).send(data);
  });

  fastify.get('/dist/*', async (request, reply) => {
    const params = request.params as { '*': string };
    const filePath = path.join('/var/www/sarif-frontend/dist/', params['*']);
    const data = fs.readFileSync(filePath, 'utf8');
    if (!data)
      return reply.code(404).send('Not found');
    return reply.type(getMimeType(filePath)).send(data);
  });
}