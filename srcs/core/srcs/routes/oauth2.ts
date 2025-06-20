import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import crypto from 'node:crypto';
import Oauth2sdk from "../../../libs/helpers/oauthSdk.ts";
import type { Oauth2sdkDbEntry } from "../../../libs/helpers/oauthSdk.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Users } from "../../../libs/interfaces/Users.ts";
import { Logger } from "../../../libs/helpers/loggers.ts";


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

    if (query.user_id) {
      // TODO: Update current user session with oauth2sdk
      return httpReply({
				detail: "User session management is not implemented yet. Please provide a user_id to associate with the client_id.",
				status: 501,
				module: "oauth2",
			}, rep, req);
    }

    await oauth2sdk.getLogin(query.client_id)
      .catch(err => {
        Logger.error(err);
        httpReply({
					detail: "Failed to fetch login URL",
					status: 500,
					module: "oauth2",
				}, rep, req);
      })
      .then(response => {
        if (!response)
          return httpReply({
						detail: "No response from Oauth2",
						status: 500,
						module: "oauth2",
					}, rep, req);
        rep.status(200).send(response.data);
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
    const jwtDec = response.data.token.jwt_decode;

    const oauth2Content: Oauth2sdkDbEntry = {
      SubjectID: jwtDec.subject || "",
      IssuerName: jwtDec.issuer || "",
      EmailAddress: jwtDec.email || "",
      FamilyName: jwtDec.family_name || "",
      FirstName: jwtDec.given_name || "",
      TokenHash: jwtDec.accesstoken_hash || "",
      IssueTime: jwtDec.issued_at || 0,
      ExpirationTime: jwtDec.expiration || 0,
      FullName: jwtDec.name || "",
    }

    // TODO: Use db SDK when available to save the oauthEntry§
    const oauth2entry = await axios.post("http://sarif_db:3000/OauthTable", {
      ...oauth2Content
    }, {
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.API_KEY || "",
      },          
    });
  
    const userContent: Users = {
      DisplayName: jwtDec.name || "Unknown User",
      EmailAddress: jwtDec.email_verified ? jwtDec.email : "",
      FamilyName: jwtDec.family_name || "",
      FirstName: jwtDec.given_name || "",
      OAuthID: oauth2Content.SubjectID || "",
      Password: "oauth2",
    }

    let userResponse: AxiosResponse<Users>;
    try {
      // TODO: Use db SDK when available
      userResponse = await axios.post("http://sarif_users:3000/Players", {
        ...userContent
      }, {
        headers: {
          "Content-Type": "application/json",
          "api_key": process.env.API_KEY || "",
        },
      });
    } catch (err) {
      Logger.error(err);
      axios.delete("http://sarif_db:3000/OauthTable", {
        headers: {
          "field": "SubjectID",
          "q": oauth2Content.SubjectID,
          "api_key": process.env.API_KEY || "",
        }
      });
      return httpReply({
				detail: "Failed to create user in database",
				status: 500,
				module: "oauth2",
			}, rep, req);
    }
    rep.status(200).send(response.data);
  });
}

export default oauth_routes;
