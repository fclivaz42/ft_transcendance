
import fastify from "fastify";
import gamePlugin from "./plugins/be_game/gamePlugin.js";
import websocketRoutes from "./plugins/websocketRoutes.js";

const app = fastify({
	logger: true,
});

export default app;

app.register(gamePlugin);
app.register(websocketRoutes);

app.get('/', async (request, reply) => {
	return { status: "sarif-pong-backend is up!\n"};
})

app.get('/test', async (request, reply) => {
	return { test: "hello world!\n"};
})

if (import.meta.url === `file://${process.argv[1]}`) {
	const start = async () => {
		try {
			await app.listen({ port: 1337, host: "0.0.0.0" });
			app.log.info(`Server listening at http://0.0.0.0:1337`);
		} catch (err) {
			app.log.error(err);
			process.exit(1);
		}
	};
	start();
}