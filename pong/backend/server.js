
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
	logger: true
});

fastify.register(fastifyStatic, {
	root: path.join(__dirname, '../frontend/dist'),
	prefix: '/',
});

fastify.setNotFoundHandler((request, reply) => {
	reply.type('text/html').sendFile('index.html');
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
})