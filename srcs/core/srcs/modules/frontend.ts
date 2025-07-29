import type { FastifyInstance } from 'fastify';
import { httpReply } from '../../../libs/helpers/httpResponse.ts';

export default async function registerFrontendModule(fastify: FastifyInstance) {
	await fastify.register(import('@fastify/static'), {
		root: "/var/www/sarif-frontend/",
		prefix: '/',
	});
	
	fastify.setNotFoundHandler(async (request, reply) => {
		if (request.raw.url?.startsWith("/api/"))
			return httpReply({
				detail: "API endpoint not found",
				status: 404,
				module: "core",
			}, reply, request);
		return reply.code(200).sendFile("");
	});
}
