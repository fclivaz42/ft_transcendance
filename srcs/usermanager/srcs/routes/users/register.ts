import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserRegisterProps, User } from '../../../../libs/interfaces/User.ts';
import databaseSdk from '../../../../libs/helpers/databaseSdk.ts';
import axios from 'axios';
import https from 'https';
import UsersValidation from "../../handlers/UsersValidation.ts";
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';
import Logger from '../../../../libs/helpers/loggers.ts';

export default async function usersRegisterEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/register", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userRegister = request.body as UserRegisterProps;
		if (!request.body || !request.body["DisplayName"] || !request.body["EmailAddress"] || !request.body["Password"])
			return reply.code(401).send("error.missing.fields")

		let resp: undefined;
		if (resp = UsersValidation.enforceUserValidation(reply, request, userRegister))
			return resp;

		const db_sdk = new DatabaseSDK();

		const user = await db_sdk.create_user(userRegister)
			.then(response => response.data)
			.catch(error => {
				Logger.error("Error creating user:" + error);
				return undefined;
			});
		if (!user || !user.PlayerID)
			return reply.status(500).send("User could not be created")
		const jwtToken = jwt.createJwtToken({
			sub: user.PlayerID,
			data: {
				DisplayName: user.DisplayName,
				EmailAddress: user.EmailAddress,
				//AvatarURL: user.AvatarURL,
			}
		});
		return reply.status(201).send({ token: jwtToken.token, ...jwtToken.payload });
	});
}
