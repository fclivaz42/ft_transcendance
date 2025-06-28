import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getTournamentMatchScore } from "../interact.ts";
import { currentContract } from "./deploy.ts";

interface MatchObj {
	winner: string,
	winnerScore: number,
	loser: string,
	loserScore: number
};

export type MatchScore = [
	winner: string,
	winnerScore: number,
	loser: string,
	loserScore: number
];

type Params = {
	id: string;
	index: number;
};

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.get<{ Params: Params }>('/id/:id/index/:index', async function handler(request, reply) {
		if (!request.headers["authorization"])
			return reply.code(401).send("Missing API-KEY");
		if (request.headers["authorization"] !== process.env.API_KEY)
			return reply.code(401).send("Invalid API-KEY");
		if (!currentContract)
			return reply.code(400).send("No contract has been set");

		const { id, index } = request.params;
		try {
			console.log(id, index);
			const [winner, winnerScoreBig, loser, loserScoreBig]: MatchScore = await getTournamentMatchScore(currentContract, id, index);
			const winnerScore = Number(winnerScoreBig);
			const loserScore = Number(loserScoreBig);
			const match: MatchObj = { winner, winnerScore, loser, loserScore };
			return reply.code(200).send(match);
		}
		catch (e) {
			return reply.code(400).send("error.bad.matchortournamentid");
		}
	})
}
