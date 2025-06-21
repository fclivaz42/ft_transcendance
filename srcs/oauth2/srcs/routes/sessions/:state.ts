import type { FastifyReply, FastifyRequest } from "fastify";
import checkRequestAuthorization from "../../managers/AuthorizationManager.ts";
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import type { OauthSessionRequest } from "../../interfaces/OauthInterfaces.ts";
import { stateManager } from "../../managers/StateManager.ts";

export async function getSessionsByState(req: FastifyRequest, rep: FastifyReply) {
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
}
