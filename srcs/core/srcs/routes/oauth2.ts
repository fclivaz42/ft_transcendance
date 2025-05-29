import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import crypto from 'node:crypto';
import Oauth2sdk from "../modules/oauth2/oauth2sdk.ts";
import { httpReply } from "../modules/oauth2/HttpResponse.ts";

const oauth2sdk = new Oauth2sdk();

async function oauth_routes(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get('/login', async (req, rep) => {
    console.error("Using random client_id for debug purposes");
    const client_id = crypto.randomBytes(16).toString('hex');

    if (!client_id) {
      httpReply(rep, req, 400, "Missing client_id in query parameters");
      return;
    }

    await oauth2sdk.getLogin(client_id)
      .catch(err => {
        console.error("Error fetching login URL:", err);
        httpReply(rep, req, 500, "Failed to fetch login URL");
      })
      .then(response => {
        if (!response) {
          httpReply(rep, req, 500, "No response from OAuth2 SDK");
          return;
        }
        rep.status(200).send(response.data);
      });
  });

  app.get('/callback', async (req, rep) => {
    const { code, state } = req.query as { code?: string; state?: string };

    if (!code || !state) {
      httpReply(rep, req, 400, "Missing code or state in query parameters");
      return;
    }

    await oauth2sdk.getCallback(code, state)
      .catch(err => {
        console.error("Error fetching callback data:", err);
        httpReply(rep, req, 500, "Failed to fetch callback data");
      })
      .then(response => {
        if (!response) {
          httpReply(rep, req, 500, "No response from OAuth2 SDK");
          return;
        }
        rep.status(200).send(response.data);
      });
  });
}

export default oauth_routes;