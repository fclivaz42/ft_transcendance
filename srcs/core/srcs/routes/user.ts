// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/12 21:55:24 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/24 20:12:50 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import type * as fft from 'fastify'

export default async function module_routes(fastify: fft.FastifyInstance, options: fft.FastifyPluginOptions) {

	// The default USER page. Displays the currently logged user, or any user provided by the UUID/DisplayName.
	// Unauthorized if the user isn't logged in.
	fastify.get('/', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The register page. This page can create new users.
	// Redirects to user page if the user is already logged in.
	fastify.get('/register', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The login page. Creates a token and stores it in the DB if username (or email)/password match.
	fastify.get('/login', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The user manager page. This page can only be accessed if you are logged in (i.e your token matches one in the DB)
	fastify.get('/manage', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The route that CREATES a user. Talks directly to the database.
	fastify.post('/register', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The route that DELETES a user. Require password one more time in headers to trigger deletion.
	fastify.delete('/delete', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})

	// The route that allows a user to update their data (eg. password, address, etc).
	fastify.put('/update', function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
	})
}
