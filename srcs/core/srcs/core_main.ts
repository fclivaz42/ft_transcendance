//	----------	//
//	SARIF CORE	//
//	----------	//

import Fastify from 'fastify'
import type * as fft from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import { betterFastify } from '../../libs/helpers/fastifyHelper.ts'
import Logger from '../../libs/helpers/loggers.ts'
import frontendRoutes from './modules/frontend/routes.ts'
import websocketPlugin from '@fastify/websocket'

if (process.env.KEYPATH === undefined || process.env.CERTPATH === undefined) {
	Logger.error("Keypath and/or Certpath are not defined. Exiting.")
	process.exit(1)
}

const fastify: fft.FastifyInstance = Fastify({
	https: {
		key: fs.readFileSync(process.env.KEYPATH),
		cert: fs.readFileSync(process.env.CERTPATH)
	}
})

const subfolder: string = path.join(import.meta.dirname, "routes")
const folder: string[] = fs.readdirSync(subfolder)

const ts_files: string[] = folder.filter(file => file.endsWith('.ts'));

async function load_modules() {
	for (const file of ts_files) {
		const file_path: string = path.join(subfolder, file)
		const module_routes = (await import(`file://${file_path}`))
		await fastify.register(module_routes, { prefix: `/${file.split(".")[0]}`.toLowerCase() })
	}
}

await fastify.register(websocketPlugin);
await load_modules()
await fastify.register(frontendRoutes);

betterFastify(fastify);

fastify.listen({ port: 443, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
