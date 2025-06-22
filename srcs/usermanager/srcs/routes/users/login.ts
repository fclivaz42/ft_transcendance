import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginProps, Users } from '../../../../libs/interfaces/Users.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import axios from 'axios';
import https from 'https';
import Logger from '../../../../libs/helpers/loggers.ts';

export default async function usersLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/login", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginProps;
		const dbSdk = new databaseSdk();

		// TODO: Polish the code once the databaseSdk is fully implemented.
		let loggedUser: Users | undefined;
		if (userLogin.DisplayName) {
			loggedUser = await axios.get<Users>(`http://db:3000/Players/username/${userLogin.DisplayName}/CheckPass`, {
				headers: {
					Authorization: process.env.API_KEY || '',
					"Content-Type": "application/json",
					"Password": userLogin.Password || '',
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			})
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by DisplayName: " + error);
					return undefined;
				});
			//loggedUser = await dbSdk.check_password(userLogin.DisplayName, "DisplayName", userLogin.Password);
		}
		else if (userLogin.EmailAddress) {
			loggedUser = await axios.get<Users>(`http://db:3000/Players/email/${userLogin.EmailAddress}/CheckPass`, {
				headers: {
					Authorization: process.env.API_KEY || '',
					"Content-Type": "application/json",
					"Password": userLogin.Password || '',
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			})
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by EmailAddress:" + error);
					return undefined;
				});
			//loggedUser = await dbSdk.check_password(userLogin.EmailAddress, "EmailAddress", userLogin.Password);
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
