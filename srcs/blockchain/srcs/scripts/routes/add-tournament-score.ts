import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { addTournamentScore } from "../interact.ts"
import dotenv from "dotenv";
import { currentContract } from "./deploy.ts";
import { z } from "zod";
dotenv.config();

const scoreSchema = z.object({
	id: z.string(),
	winner: z.string(),
	winnerScore: z.number(),
	loser: z.string(),
	loserScore: z.number()
});


export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.post('/', async function handler(request, reply) {

		if (request.headers["content-type"] !== "application/json")
			return reply.code(400).send("Need application/json header");
		if (!request.headers["authorization"])
			return reply.code(401).send("Missing API-KEY");
		if (request.headers["authorization"] !== process.env.API_KEY)
			return reply.code(401).send("Invalid API-KEY");
		if (!currentContract)
			return reply.code(400).send("No contract has been set");

		try {
			const body = scoreSchema.parse(await request.body);
			const address = await addTournamentScore(currentContract, body.id, body.winner, body.winnerScore, body.loser, body.loserScore);
			return reply.code(200).send(`Score added at: ${address}`);
		}
		catch (e) {
			return reply.code(400).send(`Json throw exception: ${e}`);
		}
	})
}
