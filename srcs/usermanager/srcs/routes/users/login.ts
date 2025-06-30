import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginProps, User } from '../../../../libs/interfaces/User.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import axios from 'axios';
import https from 'https';
import Logger from '../../../../libs/helpers/loggers.ts';
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';

export default async function usersLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/login", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginProps;
		const db_sdk = new DatabaseSDK();

		let loggedUser: User | undefined;
		if (userLogin.DisplayName) {
			loggedUser = await db_sdk.log_user(userLogin.DisplayName, "DisplayName", userLogin.Password)
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by DisplayName: " + error);
					return undefined;
				});
		}
		else if (userLogin.EmailAddress) {
			loggedUser = await db_sdk.log_user(userLogin.EmailAddress, "EmailAddress", userLogin.Password)
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by EmailAddress:" + error);
					return undefined;
				});
		}
		else
			return httpReply({
				module: "usermanager",
				detail: "Invalid login request, username or email is required.",
				status: 400
			}, reply, request);

		if (!loggedUser) {
			return httpReply({
				module: "usermanager",
				detail: "Login credentials are incorrect.",
				status: 401
			}, reply, request);
		}
		if (!loggedUser.PlayerID)
			throw new Error("Missing PlayerID in user data");

		// il est le bon user le batard
		// implementer le 2FA ici
		// creer le 2FAtoken, envoyer le lien a l'email du user
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
