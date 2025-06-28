import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { User } from "../../../libs/interfaces/User.ts";
import usersOauthLoginEndpoint from "./users/oauthLogin.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import UsersValidation from "../handlers/UsersValidation.ts";
import DatabaseSDK from "../../../libs/helpers/databaseSdk.ts";
import Logger from "../../../libs/helpers/loggers.ts";
import axios from "axios";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {

	const db_sdk = new DatabaseSDK();

	app.get("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const user = await db_sdk.get_user(params.uuid, "PlayerID");
		try {
			await db_sdk.get_user_picture(params.uuid);
			user.data.Avatar = `/api/users/${params.uuid}/picture`;
		} catch (error) {
			Logger.debug(`No picture found for user ${params.uuid}:\n${error}`);
		}
		return reply.code(user.status).send(user.data);
	});

	app.get("/:uuid/picture", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const resp = await db_sdk.get_user_picture(params.uuid)
			.catch((error) => {
				if (axios.isAxiosError(error) && error.response) {
					Logger.debug(`Error getting user picture for ${params.uuid}`);
					return httpReply({module: "usermanager", detail: error.response.statusText, status: error.response.status}, reply, request);
				}
				throw error;
			});
		if (resp.status > 300)
			return reply.code(resp.status).send(resp.statusText);
		if (!resp.data)
			return reply.code(404).send("User picture not found");
		return reply.headers(resp.headers as any).send(resp.data);
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
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const user: Partial<User> = {}
		const params = request.params as { uuid: string };
		let resp: undefined | object;
		const formdata = new FormData();
		for await (const part of request.parts()) {
			if (part.type === "field")
				user[part.fieldname] = part.value
			else {
				if (formdata.keys.length !== 0)
					continue;
				if (part.mimetype.includes("image/")) {
					const chunks: Uint8Array[] = [];
					const file = part.file;
					for await (const chunk of file)
						chunks.push(chunk);
					const buffer = Buffer.concat(chunks);
					formdata.append("file", new File([buffer], part.filename, { type: part.mimetype }));
				}
			}
		}
		if (resp = UsersValidation.enforceUserValidation(reply, request, user))
			return resp;
		resp = undefined;
		if (formdata.has("file")) {
			const update = await db_sdk.set_user_picture(params.uuid, formdata)
			if (update.status > 300)
				return reply.code(update.status).send(update.statusText);
			resp = { status: update.status, picture: update.statusText }
		}
		if (JSON.stringify(user) !== "{}") {
			user.PlayerID = params.uuid;		// Override PlayerID in case someone tried to set it manually
			const db = await db_sdk.update_user(user as User)
			resp = { status: db.status, code: db.data }
		}
		if (!resp)
			return reply.code(200).send("Nothing to do")
		return reply.code(resp.status).send(resp.data);
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

	app.get("/:uuid/matches", async (request, reply) => {
		Logger.info("Received request for matches");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		if (!request.headers["x-jwt-token"])
			return httpReply({
				detail: "X-JWT-Token header is missing",
				status: 400,
				module: "usermanager",
			}, reply, request);

		const params = request.params as { uuid: string };
		const matches = await db_sdk.get_player_matchlist(params.uuid);
		return reply.code(matches.status).send(matches.data);
	});

	usersAuthorizeEndpoint(app, opts);
	usersLoginEndpoint(app, opts);
	usersRegisterEndpoint(app, opts);
	usersOauthLoginEndpoint(app, opts);
}
