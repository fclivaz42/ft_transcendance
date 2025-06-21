import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../handlers/HttpResponse.ts';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import axios from 'axios';
import https from 'https';

export default async function usersAuthorizeEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/authorize", async (request, reply) => {
		const req = checkRequestAuthorization(request, reply);
		if (req)
			return req;
		if (!request.headers["x-jwt-token"])
			return httpReply(reply, request, 401, "X-JWT-Token header is missing");

		const XJWTToken = request.headers["x-jwt-token"].toString();

		const jwtToken = jwt.verifyToken(XJWTToken);
		if (!jwtToken.valid) {
			if (jwtToken.error === 'JWT token has expired'
				|| jwtToken.error === 'Invalid JWT signature'
				|| jwtToken.error === 'Invalid JWT issuer')
				return httpReply(reply, request, 403, "Forbidden: " + jwtToken.error);
			return httpReply(reply, request, 401, "Invalid JWT token");
		}

		// TODO: Replace db axios with sdk call
		if (!jwtToken.payload)
			return httpReply(reply, request, 401, "JWT token payload is missing");
		// Check if the user exists in the database
		try {
			await axios.get(`http://sarif_db:3000/Players/id/${jwtToken.payload.sub}`, {
				headers: {
					"Authorization": process.env.API_KEY || "",
					"Content-Type": "application/json",
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			});
		} catch (err) {
			return httpReply(reply, request, 401, "Invalid JWT token: User not found");
		}
		return reply.send({ ...jwtToken.payload });
	});
}
