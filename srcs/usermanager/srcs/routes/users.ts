import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import axios from "axios";
import https from "https";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";

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
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const resp = await axios.delete(`http://sarif_db:3000/Players`, {
      headers: {
        "api_key": process.env.API_KEY || "",
        "field": "PlayerID",
        "query": params.uuid,
      },
      httpsAgent,
    });
    return reply.code(resp.status).send(resp.data);
  });

  app.put("/:uuid", async (request, reply) => {
    if (process.env.RUNMODE?.toLowerCase() === "debug")
      console.debug("PUT /users/:uuid called");
    const authorization = checkRequestAuthorization(request, reply);
    if (authorization)
      return authorization;
    const params = request.params as { uuid: string };
    // TODO: Update user data by UUID in the database
  });

  usersAuthorizeEndpoint(app, opts);
  usersLoginEndpoint(app, opts);
  usersRegisterEndpoint(app, opts);
  //usersLoginOauth2Endpoint(app, opts);
  //usersRegisterOauth2Endpoint(app, opts);
}