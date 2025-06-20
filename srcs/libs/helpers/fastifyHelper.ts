import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Logger from './loggers.ts';
import type { AddressInfo } from 'node:net';
import { Server } from "https";

export function fastifyLogger(request: FastifyRequest | any, response?: FastifyReply | any): void {
	let message = `${request.method} ${request.url} - ${request.ip}`;
	if (response) {
		message += ` - Response ${response.statusCode}`;
		if (response.statusCode >= 400) {
			Logger.warn(message);
			return;
		}
	}
	Logger.info(message);
}

/**
 * 
 * @param serverRef The Fastify server instance
 * @description This function enhances the Fastify server instance with additional logging capabilities.
 */
export function betterFastify(serverRef: FastifyInstance | any) {
	const server = serverRef as FastifyInstance;
	server.addHook("onResponse", async (req, res) => {
		fastifyLogger(req, res);
	});
	
	server.addHook("onError", async (req, res, error) => {
		Logger.error(`Error occurred: ${error.message}`);
		fastifyLogger(req, res);
	});
	
	server.addHook("onListen", () => {
		if (server.server instanceof Server)
			Logger.info(`Listening on https://127.0.1:${(server.server.address() as AddressInfo).port}/`);
		else
			Logger.info(`Listening on http://127.0.0.1:${(server.server.address() as AddressInfo).port}/`);
	});
}
