import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginOauthProps, Users } from '../../../../libs/interfaces/Users.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import axios from 'axios';
import https from 'https';

export default async function usersOauthLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/oauthLogin", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginOauthProps;
		const dbSdk = new databaseSdk();

		// TODO: Polish the code once the databaseSdk is fully implemented.
		const loggedUser = (await axios.get<Users>(`http://sarif_db:3000/Players/oauth/${userLogin.OAuthID}`, {
			headers: {
				Authorization: process.env.API_KEY || '',
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		})).data;
		if (!loggedUser.PlayerID)
			throw new Error("User not found");
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
