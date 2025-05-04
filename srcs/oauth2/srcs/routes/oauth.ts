// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { OauthToken, OauthLoginRequest, OauthCallbackRequest, OauthSessionRequest } from '../interfaces/OauthInterfaces';

import axios from 'axios';
import { config } from "../managers/ConfigManager.ts";
import checkRequestAuthorization from '../managers/AuthorizationManager.ts';
import { GoogleJwtManager } from '../managers/GoogleJwtManager.ts';
import { stateManager } from '../managers/StateManager.ts';

// TODO: logout, me ep
// TODO: Auto-cleanup for sessions

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		checkRequestAuthorization(req, rep)

		const query = req.query as OauthLoginRequest;
		if (!query.clientid) {
			rep.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing clientid query from request"});
			return;
		}

		const state = stateManager.addState(query.clientid);
		const params = new URLSearchParams({
			client_id: config.OauthConfig.client_id,
			redirect_uri: config.OauthConfig.callback,
			scope: config.OauthConfig.scope,
			response_type: "code",
			state,
		});
		const url = new URL(`${config.OauthConfig.authorization_ep}?${params.toString()}`);
		return {url, state}
	});

	app.get("/callback", async(req, rep) => {
		checkRequestAuthorization(req, rep);

		const query = req.query as OauthCallbackRequest;
		if (!query.code) {
			rep.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing code query from request"});
			return;
		}
		if (!query.state) {
			rep.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing state query from request"});
			return;
		}

		if (!stateManager.getStateValue(query.state)) {
			rep.status(404).send({ statusCode: 404, error: "Not Found", message: "State id was not found."});
			return;
		}

		const state:string = query.state;

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
				stateManager.initSession(state, token);
				rep.status(200).send({...(resp.data as OauthToken)});
			})
			.catch(err => {
				console.error(err);
				stateManager.initSession(state, null);
				rep.status(500).send({ statusCode: 500, error: "Internal Server Error", message: "Could not fetch access_token"});
			});
	});

	app.get("/sessions/:state", async(req, rep) => {
		checkRequestAuthorization(req, rep);

		const params = req.params as OauthSessionRequest;
		if (!params.state) {
			rep.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing state param from request"});
			return;
		}

		const state = params.state;
		console.log(`searching ${state}`);

		if (stateManager.getStateValue(state) !== undefined) {
			rep.status(202).send({ statusCode: 202, message: "Session is still being processed"});
			return;
		}
		const session = stateManager.getSession(state);
		if (session)
			rep.status(200).send({...session});
		else
			rep.status(404).send({statusCode: 404, error: "Not Found", message: "Session not found"});
	})
}

export default oauthRoutes;
