import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "./ConfigManager.ts";
import { httpReply } from "./HttpResponse.ts";

export default function checkRequestAuthorization(req: FastifyRequest, rep: FastifyReply) {
	if (req.headers.authorization === config.ServerConfig.api_key)
		return;
	httpReply(rep, req, 401, "You are not authorized to access this resource");
	throw new Error("Unauthorized access");
}
