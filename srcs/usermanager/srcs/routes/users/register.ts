import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserRegisterProps, User } from '../../../../libs/interfaces/User.ts';
import axios from 'axios';
import UsersValidation from "../../handlers/UsersValidation.ts";
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';
import Logger from '../../../../libs/helpers/loggers.ts';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';

export default async function usersRegisterEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/register", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userRegister = request.body as UserRegisterProps;
		if (!request.body || !request.body["DisplayName"] || !request.body["EmailAddress"] || !request.body["Password"]) {
			return httpReply({
				detail: "Missing required fields: DisplayName, EmailAddress, Password",
				status: 400,
				module: "usermanager",
			}, reply, request);
		}

		let resp: undefined;
		if (resp = UsersValidation.enforceUserValidation(reply, request, userRegister))
			return resp;

		const db_sdk = new DatabaseSDK();

		const user = await db_sdk.create_user(userRegister)
			.then(response => response.data)
			.catch(error => {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 409) {
						return httpReply({
							detail: error.response.data || "error.duplicate",
							status: 409,
							module: "usermanager",
						}, reply, request);
					}
					else if (error.response?.status === 503) {
						return httpReply({
							detail: error.response.data || "error.database.down",
							status: 503,
							module: "usermanager",
						}, reply, request);
					}
				}
				Logger.error("Error creating user:" + error);
				return undefined;
			});
		if (!user || !user.PlayerID) {
			return httpReply({
				detail: "User creation failed",
				status: 500,
				module: "usermanager",
			}, reply, request);
		}
		const jwtToken = jwt.createJwtToken({
			sub: user.PlayerID,
			data: {
				DisplayName: user.DisplayName,
				EmailAddress: user.EmailAddress,
			}
		});
		return reply.status(201).send({ token: jwtToken.token, ...jwtToken.payload });
	});
}
