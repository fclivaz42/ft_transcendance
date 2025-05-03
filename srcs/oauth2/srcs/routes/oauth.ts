// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { OauthRequest, OauthToken } from '../interfaces/OauthInterfaces';

import axios from 'axios';
import { config } from "../managers/ConfigManager.ts";
import checkRequestAuthorization from '../managers/AuthorizationManager.ts';

// login, callback, logout, me

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		const params = new URLSearchParams({
			client_id: config.OauthConfig.client_id,
			redirect_uri: config.OauthConfig.callback,
			response_type: "code"
		});
		const url = new URL(`${config.OauthConfig.server}/authorize?${params.toString()}`);
		return {url}
	});
	app.get("/callback", async(req, rep) => {
		checkRequestAuthorization(req, rep);
		const query = req.query as OauthRequest;
		if (!query.code)
			throw new Error("Missing code query");
		const reqToken = await axios.request({
			url: `${config.OauthConfig.server}/token`,
			method: "post",
			auth: {
				username: config.OauthConfig.client_id,
				password: config.OauthConfig.secret
			},
			data: { "grant_type": "client_credentials" }
		});
		if (reqToken.status !== 200) {
			console.dir(reqToken.statusText);
			throw new Error("couldn't fetch access_token");
		}
		const token = reqToken.data as OauthToken;
		return {...token};
	})
}

export default oauthRoutes;
