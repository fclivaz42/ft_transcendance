import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { interact } from "../interact.ts"
import { log } from "console";

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', function handler(request, reply) {
		interact();
		reply.code(200).send("Interact completed");
	})
}
