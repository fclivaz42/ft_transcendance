import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { httpReply } from '../../handlers/HttpResponse.ts';
import { jwt } from '../../managers/JwtManager.ts';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';

export default async function usersAuthorizeEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get("/authorize", async (request, reply) => {
    if (process.env.RUNMODE?.toLowerCase() === "debug")
      console.debug("GET /users/authorize called");
    const req = checkRequestAuthorization(request, reply);
    if (req)
      return req;
    if (!request.headers["x-jwt-token"])
      return httpReply(reply, request, 401, "X-JWT-Token header is missing");

    const XJWTToken = request.headers["x-jwt-token"].toString().split(" ");
    if (XJWTToken?.length !== 2 || XJWTToken[0] !== "Bearer")
      return httpReply(reply, request, 401, "Invalid X-JWT-Token header format");

    const jwtToken = jwt.verifyToken(XJWTToken[1]);
    if (!jwtToken.valid) {
      if (jwtToken.error === 'JWT token has expired'
        || jwtToken.error === 'Invalid JWT signature'
        || jwtToken.error === 'Invalid JWT issuer')
          return httpReply(reply, request, 403, "Forbidden: " + jwtToken.error);
      return httpReply(reply, request, 401, "Invalid JWT token");
    }
    return reply.send({...jwtToken.payload});
  });
}