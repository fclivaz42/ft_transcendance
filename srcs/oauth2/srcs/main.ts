import fastify from "fastify";
import oauthRoutes from "./routes/oauth.ts";
import { config } from "./managers/ConfigManager.ts";
import fs from "node:fs";
import { Logger } from "../../libs/helpers/loggers.ts";
import { fastifyLogger } from "../../libs/helpers/fastifyHelper.ts";

const server = fastify({
	https: {
		key: fs.readFileSync(config.ServerConfig.cert._keypath),
		cert: fs.readFileSync(config.ServerConfig.cert._certpath)
	}
});

server.register(oauthRoutes, {prefix: "/oauth"});

server.listen({ port: config.ServerConfig.port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});

server.addHook("onResponse", async (req, res) => {
	fastifyLogger(req, res);
});

server.addHook("onError", async (req, res, error) => {
	Logger.error(`Error occurred: ${error.message}`);
	fastifyLogger(req, res);
});

server.addHook("onListen", () => {
	if (!config.ServerConfig.cert._keypath || !config.ServerConfig.cert._certpath)
		Logger.info(`Listening on http://127.0.1:${config.ServerConfig.port}/`);
	else
		Logger.info(`Listening on https://127.0.0.1:${config.ServerConfig.port}/`);
});
