import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "./ConfigManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";

export default function checkRequestAuthorization(req: FastifyRequest, rep: FastifyReply) {
	if (req.headers.authorization === `Bearer ${config.ServerConfig.api_key}`)
		return;
	return httpReply({
		detail: "Unauthorized request. Please provide a valid API key in the Authorization header.",
		status: 401,
		module: "oauth2",
	}, rep, req);
}
