import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get("/:uuid", async (request, reply) => {
    const params = request.params as { uuid: string };
    // TODO: Fetch user data by UUID from the database
  });

  app.delete("/:uuid", async (request, reply) => {
    const params = request.params as { uuid: string };
    // TODO: Delete user by UUID from the database
  });

  app.put("/:uuid", async (request, reply) => {
    const params = request.params as { uuid: string };
    // TODO: Update user data by UUID in the database
  });

  usersAuthorizeEndpoint(app, opts);
  usersLoginEndpoint(app, opts);
  //usersRegisterEndpoint(app, opts);
  //usersLoginOauth2Endpoint(app, opts);
  //usersRegisterOauth2Endpoint(app, opts);
}