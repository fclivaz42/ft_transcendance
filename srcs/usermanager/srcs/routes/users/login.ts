import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes } from 'crypto';

export default async function userLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post("/login", async (request, reply) => {
    // TODO: Implement user authentication logic here
    // For now, we will simulate a successful login by generating a fake user ID and JWT token.
    // sub property in JWT payload should be the user ID.
    // you can add more properties to the payload as needed in data object.

    // Keep in mind that you can either recieve username, password (and 2fa in the future) **OR** Oauth2 token
    // @RPDJF will implement the Oauth2 token validation in the future once the usermanager will be mature enough.
    const fakeUserId = randomBytes(32).toString("hex");
    const jwtToken = jwt.createJwtToken({
      sub: fakeUserId,
      data: {
        somestring: "Not necessary but you can pass non-critical-sensitive data here if needed, or encrypt it yourself",
      }
    });
    return reply.status(200).send({token: jwtToken.token});
  });
}