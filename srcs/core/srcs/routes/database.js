// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   database.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/12 21:55:24 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/12 23:28:59 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { test_delete, test_get, test_post, test_put } from '../modules/database/db_testers.js'

export default async function module_routes(fastify, options)
{
	fastify.get('/players', function handler(request, reply) {
		test_get(request, reply)
	})

	fastify.post('/players', function handler(request, reply) {
		test_post(request, reply)
	})

	fastify.delete('/players', function handler(request, reply) {
		test_delete(request, reply)
	})

	fastify.put('/players', function handler(request, reply) {
		test_put(request, reply)
	})

	fastify.get('/matches', function handler(request, reply) {
		test_get(request, reply)
	})
}
