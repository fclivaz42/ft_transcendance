import fastify from "fastify";
import oauthRoutes from "./routes/index.ts";
import { config } from "./managers/ConfigManager.ts";
import fs from "node:fs";
import { betterFastify } from "../../libs/helpers/fastifyHelper.ts";

const server = fastify({
	https: {
		key: fs.readFileSync(config.ServerConfig.cert._keypath),
		cert: fs.readFileSync(config.ServerConfig.cert._certpath)
	}
});

server.register(oauthRoutes, {prefix: "/oauth"});

betterFastify(server);

server.listen({ port: config.ServerConfig.port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});
