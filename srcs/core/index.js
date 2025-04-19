// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/18 22:02:50 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/19 02:02:41 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { dbget, dbpost } from "./core_db.js"
import Fastify from 'fastify'

const fastify = Fastify({
	logger: true
})

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

fastify.register(dbget)
fastify.register(dbpost)

// Run the server!
fastify.listen({ port: 443, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
