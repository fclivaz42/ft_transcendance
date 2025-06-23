import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserRegisterProps, Users } from '../../../../libs/interfaces/Users.ts';
import databaseSdk from '../../../../libs/helpers/databaseSdk.ts';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';
import axios from 'axios';
import https from 'https';

export default async function usersRegisterEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/register", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userRegister = request.body as UserRegisterProps;
		const dbSdk = new databaseSdk();

		// TODO: Remove axios request, use sdk instead once the databaseSdk is fully implemented.
		const user = (await axios.post<Users>("http://db:3000/Players", userRegister, {
			headers: {
				"Authorization": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		})).data;
		if (!user.PlayerID)
			throw new Error("User registration failed, PlayerID is missing in the response.");
		//const user = await dbSdk.create_user(userRegister) as Users;
		const jwtToken = jwt.createJwtToken({
			sub: user.PlayerID,
			data: {
				DisplayName: user.DisplayName,
				EmailAddress: user.EmailAddress,
				//AvatarURL: user.AvatarURL,
			}
		});
		return reply.status(201).send({token: jwtToken.token, ...jwtToken.payload});
	});
}
