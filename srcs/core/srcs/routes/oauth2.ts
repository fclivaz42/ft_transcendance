import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import Oauth2sdk from "../../../libs/helpers/oauthSdk.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import { Logger } from "../../../libs/helpers/loggers.ts";
import UsersSdk from "../../../libs/helpers/usersSdk.ts";


const oauth2sdk = new Oauth2sdk();

async function oauth_routes(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get('/login', async (req, rep) => {
    const query = req.query as { client_id?: string ; user_id?: string };
    if (!query.client_id) {
      return httpReply({
				detail: "Missing client_id query parameter. Please provide a client_id to identify the browser session.",
				status: 400,
				module: "oauth2",
			}, rep, req);
    }

    await oauth2sdk.getLogin(query.client_id)
			.then(response => {
				if (!response)
					return httpReply({
						detail: "No response from Oauth2",
						status: 500,
						module: "oauth2",
					}, rep, req);
				rep.status(200).send(response.data);
			})
      .catch(err => {
        Logger.error(err);
        httpReply({
					detail: "Failed to fetch login URL",
					status: 500,
					module: "oauth2",
				}, rep, req);
      });
  });

  app.get('/callback', async (req, rep) => {
    // TODO: Need to test this route
    const { code, state } = req.query as { code?: string; state?: string };

    if (!code || !state)
      return httpReply({
				detail: "Missing code or state in query parameters.",
				status: 400,
				module: "oauth2",
			}, rep, req);

    const response = await oauth2sdk.getCallback(code, state);
    if (!response)
      return httpReply({
				detail: "No response from OAuth2 module",
				status: 500,
				module: "oauth2",
			}, rep, req);
		UsersSdk.showerCookie(rep, response.data.token, response.data.exp - response.data.iat);
		rep.status(303).header('Location', '/');
  });
}

export default oauth_routes;
