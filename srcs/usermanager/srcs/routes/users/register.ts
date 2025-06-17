import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';

export default async function usersRegisterEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post("/register", async (request, reply) => {
    if (process.env.RUNMODE?.toLowerCase() === "debug")
      console.debug("POST /users/register called");
    const authorization = checkRequestAuthorization(request, reply);
    if (authorization)
      return authorization;
  });
}