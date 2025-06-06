import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import crypto from 'node:crypto';
import Oauth2sdk from "../modules/oauth2/oauth2sdk.ts";
import type { Oauth2sdkDbEntry } from "../modules/oauth2/oauth2sdk.ts";
import { httpReply } from "../modules/oauth2/HttpResponse.ts";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { UsersSdkUser } from "../modules/users/usersSdk.ts";


const oauth2sdk = new Oauth2sdk();

async function oauth_routes(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get('/login', async (req, rep) => {
    console.error("Using random client_id for debug purposes");
    const client_id = crypto.randomBytes(16).toString('hex');
    const query = req.query as { client_id?: string ; user_id?: string };

    if (!query.client_id) {
      return httpReply(rep, req, 400, "Missing client_id query from request. Please provide a client_id to identify the browser session.");
    }

    if (query.user_id) {
      // TODO: Update current user session with oauth2sdk
      return httpReply(rep, req, 501, "User session management is not implemented yet. Please provide a user_id to associate with the client_id.");
    }

    await oauth2sdk.getLogin(query.client_id)
      .catch(err => {
        console.error("Error fetching login URL:", err);
        httpReply(rep, req, 500, "Failed to fetch login URL");;
      })
      .then(response => {
        if (!response)
          return httpReply(rep, req, 500, "No response from OAuth2 SDK");
        rep.status(200).send(response.data);
      });
  });

  app.get('/callback', async (req, rep) => {
    // TODO: Need to test this route
    const { code, state } = req.query as { code?: string; state?: string };

    if (!code || !state)
      return httpReply(rep, req, 400, "Missing code or state in query parameters");

    const response = await oauth2sdk.getCallback(code, state);
    if (!response)
      return httpReply(rep, req, 500, "No response from OAuth2 SDK");
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
  
    const userContent: Partial<UsersSdkUser> = {
      DisplayName: jwtDec.name || "Unknown User",
      EmailAddress: jwtDec.email_verified ? jwtDec.email : "",
      FamilyName: jwtDec.family_name || "",
      FirstName: jwtDec.given_name || "",
      OAuthID: oauth2Content.SubjectID || "",
      PassHash: "oauth2",
    }

    let userResponse: AxiosResponse<UsersSdkUser> | null = null;
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
      console.error("Error creating user:", err);
      axios.delete("http://sarif_db:3000/OauthTable", {
        headers: {
          "field": "SubjectID",
          "q": oauth2Content.SubjectID,
          "api_key": process.env.API_KEY || "",
        }
      });
      return httpReply(rep, req, 500, "Failed to create user in database");
    }
    rep.status(200).send(response.data);
  });
}

export default oauth_routes;