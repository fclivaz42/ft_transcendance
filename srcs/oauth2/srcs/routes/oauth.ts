import { FastifyInstance, FastifyPluginOptions } from 'fastify';

// login, callback, logout, me

async function oauthRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.get("/", async(req, rep) => {
		return {url: `${process.env.OAUTH_AUTHORIZATION}?client_id=${process.env.OAUTH_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT}&response_type=code`}
	});
}

export default oauthRoutes;