// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { OauthRequest, OauthToken, GoogleJwtDecoded } from '../interfaces/OauthInterfaces';

import axios from 'axios';
import { config } from "../managers/ConfigManager.ts";
import checkRequestAuthorization from '../managers/AuthorizationManager.ts';
import { GoogleJwtManager } from '../managers/GoogleJwtManager.ts';

// login, callback, logout, me

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		const params = new URLSearchParams({
			client_id: config.OauthConfig.client_id,
			redirect_uri: config.OauthConfig.callback,
			scope: config.OauthConfig.scope,
			response_type: "code"
		});
		const url = new URL(`${config.OauthConfig.authorization_ep}?${params.toString()}`);
		return {url}
	});
	app.get("/callback", async(req, rep) => {
		checkRequestAuthorization(req, rep);
		const query = req.query as OauthRequest;
		if (!query.code) {
			rep.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing code query from request"});
			return;
		}

		const reqToken = axios.post(config.OauthConfig.token_ep, {
			code: query.code,
			client_id: config.OauthConfig.client_id,
			client_secret: config.OauthConfig.secret,
			redirect_uri: config.OauthConfig.callback,
			grant_type: config.OauthConfig.grant_type
		}, { validateStatus: (status) => status >= 200 && status < 300 });

		await reqToken
			.then(resp => {
				const token = resp.data as OauthToken;
				if (token.id_token) {
					try {
						const googleJwt = new GoogleJwtManager(token.id_token);
						token.jwt_decode = googleJwt.jwtDecoded;
					} catch (err) { token.jwt_decode = null; }
				}
				rep.status(200).send({...(resp.data as OauthToken)});
			})
			.catch(err => {
				console.error(err);
				rep.status(500).send({ statusCode: 500, error: "Internal Server Error", message: "Could not fetch access_token"});
			});
	});
}

export default oauthRoutes;
