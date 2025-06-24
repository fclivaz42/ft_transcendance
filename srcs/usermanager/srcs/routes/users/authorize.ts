import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../../../libs/helpers/httpResponse.ts';
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
			return httpReply({
				detail: "X-JWT-Token header is missing",
				status: 400,
				module: "usermanager",
			}, reply, request);

		const XJWTToken = request.headers["x-jwt-token"].toString();

		const jwtToken = jwt.verifyToken(XJWTToken);
		if (!jwtToken.valid) {
			if (jwtToken.error === 'JWT token has expired'
				|| jwtToken.error === 'Invalid JWT signature'
				|| jwtToken.error === 'Invalid JWT issuer')
				return httpReply({
					detail: jwtToken.error,
					status: 401,
					module: "usermanager",
				}, reply, request);
			return httpReply({
				detail: "Invalid JWT token",
				status: 401,
				module: "usermanager",
			}, reply, request);
		}

		// TODO: Replace db axios with sdk call
		if (!jwtToken.payload)
			return httpReply({
				detail: "JWT token payload is missing",
				status: 401,
				module: "usermanager",
			}, reply, request);
		// Check if the user exists in the database
		try {
			await axios.get(`http://db:3000/Players/id/${jwtToken.payload.sub}`, {
				headers: {
					"Authorization": process.env.API_KEY || "",
					"Content-Type": "application/json",
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			});
		} catch (err) {
			return httpReply({
				detail: "User not found",
				status: 404,
				module: "usermanager",
			}, reply, request);
		}
		return reply.send({ ...jwtToken.payload });
	});
}
