import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import axios from "axios";
import https from "https";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { User } from "../../../libs/interfaces/User.ts";
import usersOauthLoginEndpoint from "./users/oauthLogin.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import UsersValidation from "../handlers/UsersValidation.ts";
import DatabaseSDK from "../../../libs/helpers/databaseSdk.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {

	const db_sdk = new DatabaseSDK();

	app.get("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const resp = await db_sdk.get_user(params.uuid, "PlayerID")
		return reply.code(resp.status).send(resp.data);
	});

	app.delete("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		// TODO: Remove axios request, use sdk instead
		const resp = await axios.delete(`http://db:3000/Players/id/${params.uuid}`, {
			headers: {
				"Authorization": process.env.API_KEY || "",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		// WARN: DELETE USER!
		// const resp = await db_sdk.delete_user
		return reply.code(resp.status).send(resp.data);
	});

	app.put("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const body = request.body as Partial<User>;
		if (body.PlayerID)
			return httpReply({
				detail: "PlayerID is not allowed to be set manually",
				status: 400,
				module: "usermanager",
			}, reply, request);

		let resp: undefined;
		if (resp = UsersValidation.enforceUserValidation(reply, request, body))
			return resp;

		// WARN: UPDATE USER!
		// const resp = await db_sdk.update_user
		const db = await axios.put(`http://db:3000/Players/id/${params.uuid}`, body, {
			headers: {
				"Authorization": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(db.status).send(db.data);
	});

	app.post("/", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		// body validation
		const body = request.body as Partial<User>;
		if (!body.DisplayName)
			return reply.code(400).send({ error: "DisplayName is required" });
		if (!body.EmailAddress)
			return reply.code(400).send({ error: "EmailAddress is required" });
		if (body.PlayerID)
			return reply.code(400).send({ error: "PlayerID is not allowed to be set manually" });

		const db = await db_sdk.create_user(body as User)
		return reply.code(db.status).send(db.data);
	});

	usersAuthorizeEndpoint(app, opts);
	usersLoginEndpoint(app, opts);
	usersRegisterEndpoint(app, opts);
	usersOauthLoginEndpoint(app, opts);
}
