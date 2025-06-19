import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import axios from "axios";
import https from "https";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { Users } from "../../../libs/interfaces/Users.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/:uuid", async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("GET /users/:uuid called");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		// TODO: Remove axios request, use sdk instead
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });
		const resp = await axios.get(`http://sarif_db:3000/Players`, {
			headers: {
				"api_key": process.env.API_KEY || "",
				"field": "PlayerID",
				"query": params.uuid
			},
			httpsAgent,
		});
		return reply.code(resp.status).send(resp.data);
	});

	app.delete("/:uuid", async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("DELETE /users/:uuid called");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		// TODO: Remove axios request, use sdk instead
		const resp = await axios.delete(`http://sarif_db:3000/Players`, {
			headers: {
				"api_key": process.env.API_KEY || "",
				"field": "PlayerID",
				"query": params.uuid,
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(resp.status).send(resp.data);
	});

	app.post("/", async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("POST /users called");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		// body validation
		const body = request.body as Partial<Users>;
		if (!body.DisplayName)
			return reply.code(400).send({ error: "DisplayName is required" });
		if (body.PlayerID)
			return reply.code(400).send({ error: "PlayerID is not allowed to be set manually" });
		delete body.PlayerID;

		const db = await axios.post(`http://sarif_db:3000/Players`, body, {
			headers: {
				"api_key": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(db.status).send(db.data);
	});

	app.put("/", async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("PUT /users/:uuid called");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const body = request.body as Partial<Users>;
		if (!body || !body.DisplayName || !body.PlayerID)
			return reply.code(400).send({ error: "DisplayName and PlayerID are required" });

		const db = await axios.put(`http://sarif_db:3000/Players`, body, {
			headers: {
				"api_key": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
		return reply.code(db.status).send(db.data);
	});

	usersAuthorizeEndpoint(app, opts);
	usersLoginEndpoint(app, opts);
	usersRegisterEndpoint(app, opts);
	//usersLoginOauth2Endpoint(app, opts);
	//usersRegisterOauth2Endpoint(app, opts);
}
