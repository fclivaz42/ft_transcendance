import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getMatchScore } from "../interact.ts"
import { currentContract } from "./deploy.ts";
import type { MatchObj, MatchScore } from "./tournament-match-score.ts";
import { throws } from "node:assert";
import { z } from "zod";

interface IdParams {
	id: string;
}

const PlayerSchema = z.tuple([
	z.string(),
	z.number()
]);

const MatchSchema = z.tuple([
	PlayerSchema,
	PlayerSchema
]);

type Player = z.infer<typeof PlayerSchema>;
type Match = z.infer<typeof MatchSchema>;

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
			if (match[0][1] == 0 && match[1][1] == 0)
				throw ("");
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
