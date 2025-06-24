import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "./ConfigManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";

export default function checkRequestAuthorization(req: FastifyRequest, rep: FastifyReply) {
	if (req.headers.authorization === config.ServerConfig.api_key)
		return;
	return httpReply({
		detail: "Unauthorized request, missing or invalid API key.",
		status: 401,
		module: "usermanager",
	}, rep, req);
}
