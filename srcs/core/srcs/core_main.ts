//	----------	//
//	SARIF CORE	//
//	----------	//

import Fastify from 'fastify'
import type * as fft from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import { betterFastify } from '../../libs/helpers/fastifyHelper.ts'
import Logger from '../../libs/helpers/loggers.ts'
import websocketPlugin from '@fastify/websocket'
import fastifyMultipart from '@fastify/multipart'
import registerFrontendModule from './modules/frontend.ts'

if (process.env.KEY_PATH === undefined || process.env.CERT_PATH === undefined) {
	Logger.error("KEY_PATH and/or CERT_PATH are not defined. Exiting.")
	process.exit(1)
}

const fastify: fft.FastifyInstance = Fastify({
	https: {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH)
	}
})

const subfolder: string = path.join(import.meta.dirname, "routes")
const folder: string[] = fs.readdirSync(subfolder)

const ts_files: string[] = folder.filter(file => file.endsWith('.ts'));

async function load_modules() {
	await registerFrontendModule(fastify);
	for (const file of ts_files) {
		const file_path: string = path.join(subfolder, file)
		const module_routes = (await import(`file://${file_path}`))
		await fastify.register(module_routes, { prefix: `/api/${file.split(".")[0]}`.toLowerCase() })
	}
}

await fastify.register(fastifyMultipart, {
	limits: {
		fileSize: 8 * 1024 * 1024
	}
})
await fastify.register(websocketPlugin);
await load_modules()

betterFastify(fastify);

fastify.addHook('onSend', async (request, reply, payload) => {
	reply.header('Server', 'Sarifcore Webserver');
	return payload;
});


fastify.listen({ port: 443, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
});
