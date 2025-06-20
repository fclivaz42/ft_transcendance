import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginProps, Users } from '../../../../libs/interfaces/Users.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";

export default async function usersLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/login", async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("POST /users/login called");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginProps;
		const dbSdk = new databaseSdk();

		// TODO: Polish the code once the databaseSdk is fully implemented.
		/*let loggedUser: Users | undefined;
		if (userLogin.username)
			loggedUser = await dbSdk.check_password(userLogin.username, "DisplayName", userLogin.password);
		else if (userLogin.email)
			loggedUser = await dbSdk.check_password(userLogin.email, "EmailAddress", userLogin.password);
		else
			return httpReply({
				module: "usermanager",
				detail: "Invalid login request, username or email is required.",
				status: 400
			}, request, reply);		
		const jwtToken = jwt.createJwtToken({
			sub: loggedUser.PlayerID,
			data: {
				DisplayName: user.DisplayName,
				EmailAddress: user.EmailAddress,
				//AvatarURL: user.AvatarURL,
			},
		});
		return reply.status(200).send({ token: jwtToken.token });*/
	});
}
