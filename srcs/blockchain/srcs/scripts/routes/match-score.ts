import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { getMatchScore } from "../interact.ts"

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', async function handler(request, reply) {
		const id = "74826787dyauwyds8a7wsd8awd7847627y84y72ihd72t48ydu92"
		console.log(await getMatchScore(id, 0));
		reply.code(200).send("Interact completed");
	})
}
