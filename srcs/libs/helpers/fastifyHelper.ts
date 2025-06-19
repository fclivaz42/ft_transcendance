import type { FastifyRequest, FastifyReply } from 'fastify';
import Logger from './loggers.ts';

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
