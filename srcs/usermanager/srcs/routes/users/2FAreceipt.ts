import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import axios from 'axios';
import https from 'https';
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';
import FixedSizeMap from '../../../../libs/interfaces/FixedSizeMap.ts'

export var codeUser = new FixedSizeMap<string, string>(500);

interface Email {
	email: string,
};

export default async function twoFaReceiptEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post<{ Params: Email }>('/2fa/email/:email', async function handler(request, reply) {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const email = request.params.email;
		if (!request.headers['code'])
			return reply.code(400).send("Missing 2fa code");

		const code = request.headers['code'];
		if (!codeUser.get(email))
			return reply.code(404).send("No 2fa code associated with this email");
		if (codeUser.get(email) !== code)
			return httpReply({
				detail: "Invalid 2fa code",
				status: 401,
				module: "usermanager",
			}, reply, request);
		const db_sdk = new DatabaseSDK();
		let loggedUser = (await db_sdk.get_user(email, "EmailAddress")).data;
		if (!loggedUser.PlayerID)
			return reply.code(404).send("No user logged at this email address");
		const jwtToken = jwt.createJwtToken({
			sub: loggedUser.PlayerID,
			data: {
				DisplayName: loggedUser.DisplayName,
				EmailAddress: loggedUser.EmailAddress,
			},
		});
		return reply.status(200).send({ token: jwtToken.token, ...jwtToken.payload });
	})
}
