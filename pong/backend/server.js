
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import path from 'path';
import { fileURLToPath } from 'url';
import websocketRoutes from 'plugins/websocketRoutes.js';
import gamePlugin from 'plugins/be_game/gamePlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
	logger: true
});

/* Registering fastify plugins */
fastify.register(fastifyWebsocket);

/* Serving the static page with canvas */
fastify.register(fastifyStatic, {
	root: path.join(__dirname, '../frontend/dist'),
prefix: '/',
});

fastify.setNotFoundHandler((request, reply) => {
	reply.type('text/html').sendFile('index.html');
});
/* *********************************** */

/* Registering my own plugins */

fastify.register(websocketRoutes);
fastify.register(gamePlugin);

/* Initializing the server */
fastify.listen({ port: 1337, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
})
/* *********************** */