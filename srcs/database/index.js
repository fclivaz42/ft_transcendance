// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/03/09 03:06:41 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { init_db } from "./db_exec.js"
import { dbget, dbpost, dbdel, dbput } from "./db_methods.js"
import Fastify from 'fastify'

const fastify = Fastify({
	logger: true
})

init_db()

console.log(process.env.API_KEY)

fastify.register(dbget)
fastify.register(dbpost)
fastify.register(dbdel)
fastify.register(dbput)

// Run the server!
fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
