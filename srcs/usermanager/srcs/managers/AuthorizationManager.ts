import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "./ConfigManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import type { JwtTokenVerifyResult } from "./JwtManager.ts";
import { jwt } from "./JwtManager.ts";

export default function checkRequestAuthorization(req: FastifyRequest, rep: FastifyReply) {
	if (req.headers.authorization === config.ServerConfig.api_key)
		return;
	return httpReply({
		detail: "Unauthorized request, missing or invalid API key.",
		status: 401,
		module: "usermanager",
	}, rep, req);
}

export async function enforceJwtToken(request: FastifyRequest, reply: FastifyReply, jwtToken: JwtTokenVerifyResult, verifiedToken?: JwtTokenVerifyResult) {
	if (!jwtToken)
		jwtToken = await jwt.verifyToken(request);
	if (!jwtToken.valid && jwtToken.error === "X-JWT-Token header is missing or invalid")
		return httpReply({
			detail: "X-JWT-Token header is missing",
			status: 400,
			module: "usermanager",
		}, reply, request);

	if (!jwtToken.valid) {
		return httpReply({
			detail: jwtToken.error || "Invalid JWT token",
			status: 401,
			module: "usermanager",
		}, reply, request);
	}
	return;
}
