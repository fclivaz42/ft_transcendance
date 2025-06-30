import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import axios from 'axios';
import https from 'https';
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';


export default async function twoFaReceiptEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/2fa", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginProps;
		const db_sdk = new DatabaseSDK();
	});
	return reply.status(200).send({ token: jwtToken.token, ...jwtToken.payload });
}
