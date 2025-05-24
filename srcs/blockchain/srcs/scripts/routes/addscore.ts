import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { addScore } from "../interact.ts"
import dotenv from "dotenv";
dotenv.config();

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', async function handler(request, reply) {
		const id = "123";
		const contract: string | any = process.env.CURRENT_CONTRACT;
		if (!contract)
			reply.code(400).send("Bad contract");

		await addScore(contract, id, "angela", 4210, "ilkay", 24);
		reply.code(200).send("Interact completed");
	})
}
