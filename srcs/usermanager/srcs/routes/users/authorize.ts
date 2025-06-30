import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import { enforceJwtToken } from '../../managers/AuthorizationManager.ts';
import { jwt } from '../../managers/JwtManager.ts';

export default async function usersAuthorizeEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/authorize", async (request, reply) => {
		const req = checkRequestAuthorization(request, reply);
		if (req)
			return req;

		const jwtToken = await jwt.verifyToken(request);

		const enforceToken = await enforceJwtToken(request, reply, jwtToken);
		if (enforceToken)
			return enforceToken;

		return reply.send({ ...jwtToken.payload });
	});
}
