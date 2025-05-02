import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fastify from "fastify";

import oauthRoutes from "./routes/oauth.ts";

const server = fastify({logger: true});

server.register(oauthRoutes, {prefix: "/oauth"});

server.listen({ port: process.env.PORT }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening at ${address}`);
});