import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import UsersSdk from "../../../libs/helpers/usersSdk.ts";
import axios from "axios";
import { checkParam } from "../helpers/checkParam.ts";

const usersSdk = new UsersSdk();

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.all('/:uuid', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for authorization.' });
		await usersSdk.usersEnforceAuthorize(reply, request);

		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const match = await usersSdk.getMatchById(params.uuid)
			.then(response => response)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN')
					return reply.code(503).send('error.module.down')
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: 'Failed to fetch user matches',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(match.status).send(match.data);
	});
}
