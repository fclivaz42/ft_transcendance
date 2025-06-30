import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getMatchScore } from "../interact.ts"
import { currentContract } from "./deploy.ts";
import type { MatchObj, MatchScore } from "./tournament-match-score.ts";

type Player = [
	name: string,
	score: number,
];

type Match = [
	winner: Player,
	loser: Player,
];

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
		try {
			const match: Match = await getMatchScore(currentContract, id);
			return reply.code(200).send({
				winner: match[0][0],
				winnerScore: Number(match[0][1]),
				loser: match[1][0],
				loserScore: Number(match[1][1])
			});
		} catch (exception) {
			return reply.code(400).send("error.bad.matchid")
		}
	})
}
