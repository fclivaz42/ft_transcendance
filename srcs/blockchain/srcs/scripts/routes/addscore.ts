import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { addScore } from "../interact.ts"

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', async function handler(request, reply) {
		const id = "74826787dyauwyds8a7wsd8awd7847627y84y72ihd72t48ydu92"
		console.log(await addScore(id, "angela", 10, "ilkay", 2));
		reply.code(200).send("Interact completed");
	})
}
