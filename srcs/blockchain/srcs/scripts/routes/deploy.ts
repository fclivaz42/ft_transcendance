import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { deploy } from "../deploy.ts"
import dotenv from "dotenv";
import { throws } from "node:assert";
dotenv.config();

export var currentContract: string;

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.get('/', async function handler(request, reply) {

		if (!currentContract)
			currentContract = await deploy();
		if (!currentContract)
			return reply.code(400).send("Deploy contract to the blockchain failed");
		// post sur la db du contrat
		return reply.code(200).send(currentContract);
	})
}
