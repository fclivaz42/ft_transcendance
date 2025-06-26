import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginOauthProps, User } from '../../../../libs/interfaces/User.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import axios from 'axios';
import https from 'https';
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';
import Logger from '../../../../libs/helpers/loggers.ts';

export default async function usersOauthLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/oauthLogin", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginOauthProps;
		const db_sdk = new DatabaseSDK();

		const loggedUser = await db_sdk.get_user(userLogin.OAuthID, "OAuthID")
			.then(response => response.data)
			.catch(error => {
				Logger.error("Error fetching user by OAuthID:" + error);
				return undefined;
			})
		if (!loggedUser || !loggedUser.PlayerID)
			return reply.status(404).send("User not found")
		const jwtToken = jwt.createJwtToken({
			sub: loggedUser.PlayerID,
			data: {
				DisplayName: loggedUser.DisplayName,
				EmailAddress: loggedUser.EmailAddress,
				//AvatarURL: loggedUser.AvatarURL,
			},
		});
		return reply.status(200).send({ token: jwtToken.token, ...jwtToken.payload });
	});
}
