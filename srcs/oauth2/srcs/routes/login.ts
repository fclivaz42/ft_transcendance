import type { FastifyReply, FastifyRequest } from "fastify";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import type { OauthLoginRequest } from "../interfaces/OauthInterfaces.ts";
import { config } from "../managers/ConfigManager.ts";
import { stateManager } from "../managers/StateManager.ts";

export async function getLogin(req: FastifyRequest, rep: FastifyReply) {
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
}
