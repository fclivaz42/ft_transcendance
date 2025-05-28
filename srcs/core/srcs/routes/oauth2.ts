import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import crypto from 'node:crypto';
import Oauth2sdk from "../modules/oauth2/oauth2sdk.ts";
import { httpReply } from "../modules/oauth2/HttpResponse.ts";

const oauth2sdk = new Oauth2sdk();

async function oauth_routes(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get('/login', async (req, rep) => {
    console.error("Using random clientId for debug purposes");
    const clientId = crypto.randomBytes(16).toString('hex');

    if (!clientId) {
      httpReply(rep, req, 400, "Missing clientId in query parameters");
      return;
    }

    await oauth2sdk.getLogin(clientId)
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
      return rep.status(400).send({ error: "Missing code or state in query parameters" });
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