import fastify from "fastify";
import initializeRoute from "./routes/users.ts";
import fs from "node:fs";
import { config } from "./managers/ConfigManager.ts";
import { betterFastify } from "../../libs/helpers/fastifyHelper.ts";
import fastifyMultipart from "@fastify/multipart";
import initializeMatchesRoute from "./routes/matches.ts";
import EmailManager from "./managers/EmailManager.ts";

EmailManager.initialize();

const server = fastify({
	https: {
		key: fs.readFileSync(config.ServerConfig.cert._KEY_PATH),
		cert: fs.readFileSync(config.ServerConfig.cert._CERT_PATH)
	}
});

await server.register(fastifyMultipart, {
	limits: {
		fileSize: 8 * 1024 * 1024
	}
})
await server.register(initializeRoute, { prefix: "/users" });
await server.register(initializeMatchesRoute, { prefix: "/matches" });

betterFastify(server);

server.listen({ port: config.ServerConfig.port, host: "::" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});
