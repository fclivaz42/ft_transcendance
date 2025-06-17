import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getMatchScore } from "../interact.ts"
import { currentContract } from "./deploy.ts";

interface Match {
	winner: string,
	winnerScore: number,
	loser: string,
	loserScore: number
};

interface IdParams {
	id: string;
}

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.get<{ Params: IdParams }>('/id/:id', async function handler(request, reply) {
		if (!request.headers["authorization"])
			return reply.code(401).send("Missing API-KEY");
		if (request.headers["authorization"] !== process.env.API_KEY)
			return reply.code(401).send("Invalid API-KEY");
		if (!currentContract)
			return reply.code(400).send("No contract has been set");
		const { id } = request.params;
		const result: Match = await getMatchScore(currentContract, id);
		return reply.code(200).send(`\nMatch: ${result}\n`);
	})
}
