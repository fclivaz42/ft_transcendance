// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { OauthRequest } from '../interfaces/OauthInterfaces';

import axios from 'axios';
import { config } from "../managers/ConfigManager.ts";

// login, callback, logout, me

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		return {url: `${config.OauthConfig.server}/authorize?client_id=${config.OauthConfig.client_id}&callback_uri=${config.OauthConfig.callback}&response_type=code`}
	});
	app.get("/callback", async(req, rep) => {
		const query = req.query as OauthRequest;
		if (!query.code)
			throw new Error("Missing code query");
		const access_token = await axios.request({
			url: `${config.OauthConfig.server}/token`,
			method: "post",
			auth: {
				username: config.OauthConfig.client_id,
				password: config.OauthConfig.secret
			},
			data: { "grant_type": "client_credentials" }
		});
		if (access_token.status !== 200) {
			console.dir(access_token.statusText);
			throw new Error("couldn't fetch access_token");
		}
		return {access_token: access_token.data.access_token};
	})
}

export default oauthRoutes;
