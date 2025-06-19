import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { deploy } from "../deploy.ts"
import dotenv from "dotenv";
dotenv.config();

export var currentContract: string;

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', async function handler(request, reply) {
		if (!request.headers["authorization"])
			return reply.code(401).send("Missing API-KEY");
		if (request.headers["authorization"] !== process.env.API_KEY)
			return reply.code(401).send("Invalid API-KEY");
		if (!currentContract)
			currentContract = await deploy();
		if (!currentContract)
			return reply.code(400).send("Contract deployment to the blockchain failed");
		return reply.code(200).send(currentContract);
	})
}

