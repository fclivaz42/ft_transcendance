// import type converts commonjs to module
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { OauthToken, OauthLoginRequest, OauthCallbackRequest, OauthSessionRequest } from "../interfaces/OauthInterfaces";

import axios from "axios";
import { config } from "../managers/ConfigManager.ts";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import { GoogleJwtManager } from "../managers/GoogleJwtManager.ts";
import { stateManager } from "../managers/StateManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import { Logger } from "../../../libs/helpers/loggers.ts";

// TODO: logout, me ep

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/login", async(req, rep) => {
		const prohibited = checkRequestAuthorization(req, rep);
		if (prohibited)
			return prohibited;

		const query = req.query as OauthLoginRequest;
		if (!query.client_id) {
			httpReply({
				detail: "Missing client_id query from request",
				status: 400,
				module: "oauth2",
			}, rep, req);
			return;
		}

		const state = stateManager.addState(query.client_id);
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
		const prohibited = checkRequestAuthorization(req, rep);
		if (prohibited)
			return prohibited;

		const query = req.query as OauthCallbackRequest;
		if (!query.code) {
			httpReply({
				detail: "Missing code query from request",
				status: 400,
				module: "oauth2",
			}, rep, req);
			return;
		}
		if (!query.state) {
			httpReply({
				detail: "Missing state query from request",
				status: 400,
				module: "oauth2",
			}, rep, req);
			return;
		}

		if (!stateManager.getStateValue(query.state)) {
			httpReply({
				detail: "State id was not found",
				status: 404,
				module: "oauth2",
			}, rep, req);
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
				const session = stateManager.initSession(state, token);
				rep.status(200).send({
					...session
				});
			})
			.catch(err => {
				Logger.error(err);
				stateManager.initSession(state, null);
				httpReply({
					detail: "Could not fetch access_token",
					status: 500,
					module: "oauth2",
				}, rep, req);
			});
	});

	app.get("/sessions/:state", async(req, rep) => {
		const prohibited = checkRequestAuthorization(req, rep);
		if (prohibited)
			return prohibited;

		const params = req.params as OauthSessionRequest;
		if (!params.state) {
			httpReply({
			detail: "Missing state parameter from request",
			status: 400,
			module: "oauth2",
			}, rep, req);
			return;
		}

		const state = params.state;

		if (stateManager.getStateValue(state) !== undefined) {
			httpReply({
				detail: "Session is still being processed",
				status: 202,
				module: "oauth2",
			}, rep, req);
			return;
		}
		const session = stateManager.getSession(state);
		if (session)
			rep.status(200).send({...session});
		else
			httpReply({
				detail: "Session state id not found",
				status: 404,
				module: "oauth2",
			}, rep, req);
	})
}

export default oauthRoutes;
