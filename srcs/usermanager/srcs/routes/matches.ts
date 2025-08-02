import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import DatabaseSDK from "../../../libs/helpers/databaseSdk.ts";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import Logger from "../../../libs/helpers/loggers.ts";
import axios from "axios";
import { httpError, httpReply } from "../../../libs/helpers/httpResponse.ts";

const dbSdk = new DatabaseSDK();

export default async function initializeMatchesRoute(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/:uuid", async (request: FastifyRequest, reply) => {
		Logger.info("Received request for matches");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		if (params[Object.keys(params)[0]] === "")
			return httpReply({
				detail: 'No Match ID given',
				status: 400,
				module: 'usermanager'
			}, reply, request);
		const resp = await dbSdk.get_match(params.uuid).catch(error => {
			if (!axios.isAxiosError(error))
				throw error;
			if (error.response?.status === 404) {
				return httpReply({
					detail: 'Match not found',
					status: 404,
					module: 'usermanager'
				}, reply, request);
			}
			return reply.code(error.response?.status || 500).send(
				error.response?.data || {
					detail: 'Failed to fetch match',
					status: error.response?.status || 500,
					module: 'usermanager'
				}
			);
		});
		return reply.send(resp.data);
	});
}
