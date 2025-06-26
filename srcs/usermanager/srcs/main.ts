import fastify from "fastify";
import initializeRoute from "./routes/users.ts";
import fs from "node:fs";
import { config } from "./managers/ConfigManager.ts";
import { betterFastify } from "../../libs/helpers/fastifyHelper.ts";
import fastifyMultipart from "@fastify/multipart";

const server = fastify({
	https: {
		key: fs.readFileSync(config.ServerConfig.cert._keypath),
		cert: fs.readFileSync(config.ServerConfig.cert._certpath)
	}
});

await server.register(fastifyMultipart)
await server.register(initializeRoute, { prefix: "/users" });

betterFastify(server);

server.listen({ port: config.ServerConfig.port, host: "::" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});
