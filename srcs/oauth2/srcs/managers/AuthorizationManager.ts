import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "./ConfigManager.ts";

export default function checkRequestAuthorization(req: FastifyRequest, rep: FastifyReply) {
	if (req.headers.authorization === config.ServerConfig.api_key)
		return;
	rep.status(401).send({ statusCode: 401, error: "Unauthorized", message: "You are not authorized to access this ressource" });
	throw new Error("Unauthorized access");
}
