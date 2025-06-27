import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Logger from './loggers.ts';
import type { AddressInfo } from 'node:net';
import { Server } from "https";

export function fastifyLogger(request: FastifyRequest | any, response?: FastifyReply | any): void {
	const [req, res] = [request, response] as [FastifyRequest, FastifyReply];
	const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown';
	let message = `${req.method} ${req.url} - ${ip}`;
	if (response) {
		message += ` - Response ${res.statusCode}`;
		if (res.statusCode >= 400) {
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
		Logger.error(`Error occurred:\n${error}`);
	});
	
	server.addHook("onListen", () => {
		if (process.env.API_KEY)
			Logger.debug(`API Key: ${process.env.API_KEY}`);
		const config = server.server.address() as AddressInfo;
		if (config.address === '::' || config.address === "0.0.0.0")
			config.address = "127.0.0.1";
		if (server.server instanceof Server)
			Logger.info(`Listening on https://${config.address}:${config.port}/`);
		else
			Logger.info(`Listening on http://${config.address}:${config.port}/`);
	});
}
