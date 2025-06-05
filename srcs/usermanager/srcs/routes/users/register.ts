import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';

export default async function usersRegisterEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post("/register", async (request, reply) => {
  });
}