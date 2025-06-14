
import fastify, { type FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

import gamePlugin from "./plugins/game/gamePlugin.ts";
import websocketRoutes from "./plugins/websocketRoutes.ts";

const app: FastifyInstance = fastify({
	logger: true,
});

if (process.env.API_KEY === undefined ||
	process.env.RUNMODE === undefined) {
	console.error("At least one of the necessary variables to run this program isn't set:",
		process.env.API_KEY === undefined ? "API_KEY" : "",
		process.env.RUNMODE === undefined ? "RUNMODE" : ""
	)
	process.exit(1)
}

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

app.register(websocket);
app.register(gamePlugin);
app.register(websocketRoutes);

app.get('/', async (request, reply) => {
	return { status: "sarif-pong-backend is up!\n" };
})

app.get('/test', async (request, reply) => {
	return { test: "hello world!\n" };
})

if (import.meta.url === `file://${process.argv[1]}`) {
	const start = async () => {
		try {
			await app.listen({ port: 1337, host: "::" });
			app.log.info(`Server listening at http://0.0.0.0:1337`);
		} catch (err) {
			app.log.error(err);
			process.exit(1);
		}
	};
	start();
}
