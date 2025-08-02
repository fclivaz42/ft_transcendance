import type { FastifyReply, FastifyRequest } from "fastify";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";

export function checkParam(param: any, type: string, name: string, req: FastifyRequest, rep: FastifyReply) {
	if (!param) {
		httpReply({
			module: "core",
			detail: `Missing parameter: ${name}`,
			status: 400
		}, rep, req);
		throw new Error(`Missing parameter: ${name}`);
	}

	if (typeof param !== type) {
		httpReply({
			module: "core",
			detail: `Invalid type for parameter: ${name}. Expected ${type}, received ${typeof param}`,
			status: 400
		}, rep, req);
		throw new Error(`Invalid type for parameter: ${name}. Expected ${type}, received ${typeof param}`);
	}
} 
