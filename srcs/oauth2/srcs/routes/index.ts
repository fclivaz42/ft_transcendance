// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getCallback } from "./callback.ts";
import { getLogin } from "./login.ts";
import { getSessionsByState } from "./sessions/:state.ts";

// TODO: logout, me ep

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		return await getLogin(req, rep);
	});

	app.get("/callback", async(req, rep) => {
		return await getCallback(req, rep);
	});

	app.get("/sessions/:state", async(req, rep) => {
		return await getSessionsByState(req, rep);
	})
}

export default oauthRoutes;
