import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import type eth from "ethers";
import { getTournamentScore } from "../interact.ts"
import { currentContract } from "./deploy.ts";

type Player = {
	player: string;
	score: bigint;
};

type TournamentScore = {
	wins: Player;
	losses: Player;
};

interface IdParams {
	id: string;
}

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.get<{ Params: IdParams }>('/id/:id', async function handler(request, reply) {
		if (!currentContract)
			return reply.code(400).send("No contract has been set");
		const { id } = request.params;
		const result: TournamentScore[] = await getTournamentScore(currentContract, id);
		return reply.code(200).send(`\nTournament: ${result}\n`);
	})
}
