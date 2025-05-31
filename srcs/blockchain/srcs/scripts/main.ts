import { ethers } from 'ethers';
import Fastify from 'fastify'
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { throws } from 'node:assert';
import fs from 'node:fs'
import path from 'node:path'

const fastify = Fastify({
	logger: true,
})

const subfolder = path.join(import.meta.dirname, "routes")
const folder = fs.readdirSync(subfolder)

const ts_files = folder.filter(file => file.endsWith('.ts'));

async function load_modules() {
	for (const file of ts_files) {
		const file_path = path.join(subfolder, file)
		const module_routes = (await import(`file://${file_path}`))
		const route_name = file.split(".")[0] === "index" ? "" : file.split(".")[0]
		fastify.register(module_routes, { prefix: `/${route_name}`.toLowerCase() })
	}
}

await load_modules();

fastify.listen({ port: 80, host: '::' }, (err, address) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	console.log(`Server running at ${address}`)
});
