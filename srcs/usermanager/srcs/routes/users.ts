import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import axios from "axios";
import https from "https";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { Users } from "../../../libs/interfaces/Users.ts";
import usersOauthLoginEndpoint from "./users/oauthLogin.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		// TODO: Remove axios request, use sdk instead
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });
		const resp = await axios.get(`http://sarif_db:3000/Players/id/${params.uuid}`, {
			headers: {
				"Authorization": process.env.API_KEY || "",
			},
			httpsAgent,
		});
		return reply.code(resp.status).send(resp.data);
	});

	app.delete("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		// TODO: Remove axios request, use sdk instead
		const resp = await axios.delete(`http://sarif_db:3000/Players/id/${params.uuid}`, {
			headers: {
				"Authorization": process.env.API_KEY || "",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(resp.status).send(resp.data);
	});

	app.put("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const body = request.body as Partial<Users>;
		if (body.PlayerID)
			return reply.code(400).send({ error: "PlayerID is not allowed to be set manually" });

		const db = await axios.put(`http://sarif_db:3000/Players/id/${params.uuid}`, body, {
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
		const body = request.body as Partial<Users>;
		if (!body.DisplayName)
			return reply.code(400).send({ error: "DisplayName is required" });
		if (!body.EmailAddress)
			return reply.code(400).send({ error: "EmailAddress is required" });
		if (body.PlayerID)
			return reply.code(400).send({ error: "PlayerID is not allowed to be set manually" });

		const db = await axios.post(`http://sarif_db:3000/Players`, body, {
			headers: {
				"Authorization": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(db.status).send(db.data);
	});

	usersAuthorizeEndpoint(app, opts);
	usersLoginEndpoint(app, opts);
	usersRegisterEndpoint(app, opts);
	usersOauthLoginEndpoint(app, opts);
}
