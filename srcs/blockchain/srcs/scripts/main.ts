import Fastify from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import Logger from '../../../libs/helpers/loggers.ts';
import { betterFastify } from '../../../libs/helpers/fastifyHelper.ts';

if (process.env.RUNMODE === "debug")
	Logger.info(process.env.API_KEY)

if (!process.env.KEY_PATH ||
	!process.env.CERT_PATH) {
		throw new Error("KEY_PATH and CERT_PATH environment variables must be set to run the server with HTTPS.");
	}

const fastify = Fastify({
	logger: false,
	https: {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH)
	}
})

betterFastify(fastify);

const subfolder = path.join(import.meta.dirname, "routes")
const folder = fs.readdirSync(subfolder)

const ts_files = folder.filter(file => file.endsWith('.ts'));
;
async function load_modules() {
	for (const file of ts_files) {
		const file_path = path.join(subfolder, file)
		const module_routes = (await import(`file://${file_path}`))
		const route_name = file.split(".")[0] === "index" ? "" : file.split(".")[0]
		fastify.register(module_routes, { prefix: `/${route_name}`.toLowerCase() })
	}
}

await load_modules();

fastify.listen({ port: 8080, host: '::' }, (err, address) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	console.log(`Server running at ${address}`)
});
