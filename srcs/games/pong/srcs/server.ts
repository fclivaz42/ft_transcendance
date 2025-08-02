import fastify, { type FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";
import fs from "node:fs";
import gamePlugin from "./plugins/game/gamePlugin.ts";
import websocketRoutes from "./plugins/websocketRoutes.ts";
import { betterFastify } from "../../../libs/helpers/fastifyHelper.ts";
import Logger from "../../../libs/helpers/loggers.ts";

if (!process.env.KEY_PATH ||
	!process.env.CERT_PATH) {
	throw new Error("KEY_PATH and CERT_PATH environment variables must be set to run the server with HTTPS.");
}

const app = fastify({
	logger: false,
	https: {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH)
	}
});

betterFastify(app);

if (process.env.API_KEY === undefined || process.env.RUNMODE === undefined) {
	console.error(
		"At least one of the necessary variables to run this program isn't set:",
		process.env.API_KEY === undefined ? "API_KEY" : "",
		process.env.RUNMODE === undefined ? "RUNMODE" : ""
	);
	process.exit(1);
}

if (process.env.RUNMODE === "debug") console.log(process.env.API_KEY);

app.register(websocket);
app.register(gamePlugin);
app.register(websocketRoutes);

app.get("/", async (request, reply) => {
	return { status: "sarif-pong-backend is up!\n" };
});

app.get("/test", async (request, reply) => {
	return { test: "hello world!\n" };
});

if (import.meta.url === `file://${process.argv[1]}`) {
	const start = async () => {
		try {
			await app.listen({ port: 1337, host: "::" });
		} catch (err) {
			Logger.error(`Error starting the server:\n${err}`);
			process.exit(1);
		}
	};
	start();
}
