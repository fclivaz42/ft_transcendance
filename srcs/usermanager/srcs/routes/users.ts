import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import userLoginEndpoint from "./users/login.ts";
import userAuthorizeEndpoint from "./users/authorize.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post("/", async (request, reply) => {
    // TODO: Implement user creation logic (e.g., register a new user), not login.
  });

  userAuthorizeEndpoint(app, opts);
  userLoginEndpoint(app, opts);
}