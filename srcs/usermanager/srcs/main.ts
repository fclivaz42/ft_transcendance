import fastify from "fastify";
import initializeRoute from "./routes/users.ts";
import fs from "node:fs";
import { config } from "./managers/ConfigManager.ts";
import { fastifyLogger } from "../../libs/helpers/fastifyHelper.ts";
import Logger from "../../libs/helpers/loggers.ts";

const server = fastify({
	logger: config.ServerConfig.logger,
	https: {
		key: fs.readFileSync(config.ServerConfig.cert._keypath),
		cert: fs.readFileSync(config.ServerConfig.cert._certpath)
	}
});

server.register(initializeRoute, {prefix: "/users"});

server.listen({ port: config.ServerConfig.port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});


server.addHook("onResponse", async (req, res) => {
	// @ts-expect-error
	fastifyLogger(req, res);
});

server.addHook("onError", async (req, res, error) => {
	Logger.error(`Error occurred: ${error.message}`);
	// @ts-expect-error
	fastifyLogger(req, res);
});