import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import axios from "axios";
import https from "https";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { User, UserWithPicture } from "../../../libs/interfaces/User.ts";
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
		const resp = await db_sdk.delete_user(params.uuid)
		return reply.code(resp.status).send(resp.data);
	});

	app.put("/:uuid", async (request, reply) => {
		console.log("WE'RE HEREEE")
		console.dir(request.headers)
		// const user: Partial<User> = {}
		// for (const item in data.fields) {
		// 	console.log("-------------------------------------------------------")
		// 	if ((data.fields[item] as any).value) {
		// 		console.log(`added ${item}`)
		// 		user[item] = (data.fields[item] as any).value
		// 	}
		// 	console.log((data.fields[item] as any).value)
		// }
		// user.PlayerID = userId
		// console.log("Ok done")
		// console.dir(user)
		let avatar: File | null = null;
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const body = request.body as Partial<UserWithPicture>;
		if (body.Avatar) {
			avatar = body.Avatar
			delete body.Avatar
		}
		body.PlayerID = params.uuid;		// Override PlayerID in case someone tried to set it manually
		let resp: undefined;
		if (resp = UsersValidation.enforceUserValidation(reply, request, body))
			return resp;
		if (avatar) {
			console.log("updating pfp")
			console.dir(avatar)
			const update = await db_sdk.set_user_picture(params.uuid, avatar)
			if (update.status > 300)
				return reply.code(update.status).send(update.statusText);
			console.log("pfp updated!")
		}
		const db = await db_sdk.update_user(body as User)
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
