// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/14 19:10:57 by fclivaz           #+#    #+#             //
//   Updated: 2025/03/14 19:13:16 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'

const server: FastifyInstance = Fastify({})

const opts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					pong: {
						type: 'string'
					}
				}
			}
		}
	}
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' }
})

try {
	await server.listen({ port: 3000, host: '::' })

	const address = server.server.address()
	const port = typeof address === 'string' ? address : address?.port

} catch (err) {
	server.log.error(err)
	process.exit(1)
}
