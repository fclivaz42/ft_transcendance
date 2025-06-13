import type { FastifyRequest, FastifyReply } from 'fastify';
import Logger from './loggers.ts';

export function fastifyLogger(request: FastifyRequest, response?: FastifyReply): void {
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