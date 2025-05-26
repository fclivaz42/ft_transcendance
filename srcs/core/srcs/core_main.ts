//	----------	//
//	SARIF CORE	//
//	----------	//

import Fastify from 'fastify'
import fs from 'node:fs'
import path from 'node:path'

const fastify = Fastify({
	logger: true
})

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

const subfolder = path.join(import.meta.dirname, "routes")
const folder = fs.readdirSync(subfolder)

const js_files = folder.filter(file => file.endsWith('.js'));

async function load_modules() {
	for (const file of js_files) {
		const file_path = path.join(subfolder, file)
		const module_routes = (await import(`file://${file_path}`))
		fastify.register(module_routes, { prefix: `/${file.split(".")[0]}`.toLowerCase() })
	}
}
await load_modules()

fastify.listen({ port: 443, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
