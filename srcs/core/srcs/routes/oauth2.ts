import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import Oauth2sdk from "../../../libs/helpers/oauthSdk.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import { Logger } from "../../../libs/helpers/loggers.ts";
import UsersSdk from "../../../libs/helpers/usersSdk.ts";
import axios from "axios";


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
    const { code, state, error } = req.query as { code?: string; state?: string, error?: string };

    if ((!code || !state) && (!error))
      return httpReply({
				detail: "Missing code or state in query parameters.",
				status: 400,
				module: "oauth2",
			}, rep, req);

    await oauth2sdk.getCallback(code as string, state as string)
			.then(response => {
				UsersSdk.showerCookie(rep, response.data.token, response.data.exp - response.data.iat);
				rep.status(303).header('Location', '/');
			})
			.catch(err => {
				if (error) {
					Logger.error(`Error in /callback route: ${error}`);
					return rep.status(303).header('Location', `/?error=notification.oauth2.callbackError;${error}`).send();
				}
				else if (!axios.isAxiosError(err)) {
					Logger.error(`Unexpected error in /callback route:\n${err}`);
					return rep.status(303).header('Location', '/?error=notification.oauth2.callbackError').send();
				}
				else if (err.response?.status === 404) {
					return rep.status(303).header('Location', '/?error=notification.oauth2.callbackError;notification.oauth2.noSession').send();
				}
				else {
					Logger.error(`Error in /callback route:\n${err}`);
					return rep.status(303).header('Location', `/?error=notification.oauth2.callbackError${err.response? ";" + err.response.data.detail : ""}`).send();
				}
			});
  });
}

export default oauth_routes;
