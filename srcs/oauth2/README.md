# SARIF Oauth2

This document provides information about the internal Oauth2 module's API used for authentication via 42's OAuth service.

> ⚠️ This is for **internal use only**. Do not expose it publicly.

---

- [`GET /login`](#get-login)
- [`GET /callback`](#get-callback)
- [Environment Variables](#environment-variables)

# 🔐 Overview

This module lets users log in using their 42 account. It does that by redirecting users to 42’s login page and then getting an access token from 42 after they log in.

# Endpoints

## `GET /login`

Gets the URL to redirect the user to the 42 OAuth authorization server.

### Response:

| Return Code | Return Content                         | Description                          |
| ----------- | -------------------------------------- | ------------------------------------ |
| `200 OK`    | `{ "url": "..." }`                     | The login URL to redirect the user. |

#### Example Response:

```json
{
	"url":"https://accounts.google.com/o/oauth2/v2/auth?client_id=someid.apps.googleusercontent.com&redirect_uri=someurl&scope=openid+email+profile&response_type=code"
}
```

## `GET /callback`

### HTTP Headers

| Key             | Required | Expected value                         | Description                                             |
| --------------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| `authorization` | yes       | whatever `process.env.API_KEY` returns | The global, build-time defined API key used internally. |

Fetch and return the access token from user.

This endpoint handles the callback from 42's OAuth server. It expects a `code` in the query string and will return an access token.

`code` is provided by the URL redirection from `GET /login` as a HTTP query.

### Required Query Parameters:

| Key   | Example         | Description                             |
| ----- | --------------- | --------------------------------------- |
| `code`| (string)  | The code returned by the OAuth server.  |

### Response:

| Return Code                 | Return Content                         | Condition                                              |
| --------------------------- | -------------------------------------- | ------------------------------------------------------ |
| `200 OK`                    | `{ "access_token": "...", ... }`           | Successfully retrieved the access token.               |
| `400 Bad Request`           | `error: Missing code query`           | The request was missing the `code` query param.  
| `401 Unauthorized`           | `error: Unauthorized`           | The request was missing the `code` query param.        |
| `500 Internal Server error` | `error: couldn't fetch access_token`  | Something went wrong during the token request process. |

#### Example Response:

> Note that jwt_decode.subject can be used as an user identifier


```json
{
   "access_token": "f43th43ui...",
   "expires_in": 3572,
   "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
   "token_type": "Bearer",
   "id_token": "fjoi3jji2ee3...",
   "jwt_decode": {
      "issuer": "https://accounts.google.com",
      "authorized_party": "someapp.apps.googleusercontent.com",
      "audience": "someaudience.apps.googleusercontent.com",
      "subject": "user uid",
      "email": "user email",
      "email_verified": true,
      "accesstoken_hash": "KdS0gvi0Jw8...",
      "name": "user fullname",
      "picture": "user picture url",
      "given_name": "first name",
      "family_name": "last name",
      "issued_at": 1746304625,
      "expiration": 1746308225
   }
}
```

# Environment Variables

These variables are defined in the `.env` file and used for configuration.

- **Global scope**: the environment variable should be defined in the root (global) `.env` file, shared across multiple modules.
- **Local scope**: the environment variable is specific to this module and should be defined in its local `.env` file.

| Variable                 | Example Value                                  | Scope  | Description                                                                                              |
| ------------------------ | ---------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `API_KEY`                | (string)                                       | Global | The key to authorize sensitive endpoints                                                                 |
| `OAUTH_LOGGER`           | `true`                                         | Local  | Enables or disables logging for the OAuth module.                                                        |
| `OAUTH_PORT`             | `3000`                                         | Local  | The port the OAuth server listens on.                                                                    |
| `OAUTH_CALLBACK`         | `http://127.0.0.1:3000/oauth/callback`         | Local  | The callback URL where the OAuth server redirects users after login. (⚠️ see notes at the end of README) |
| `OAUTH_AUTHORIZATION_EP` | `https://accounts.google.com/o/oauth2/v2/auth` | Local  | The base URL for Google's OAuth authorization endpoint.                                                  |
| `OAUTH_TOKEN_EP`         | `https://oauth2.googleapis.com/token`          | Local  | The endpoint for exchanging the authorization code for an access token.                                  |
| `OAUTH_SCOPE`            | `"openid email profile"`                       | Local  | The OAuth scopes for requesting user data (openid, email, and profile).                                  |
| `OAUTH_GRANT_TYPE`       | `"authorization_code"`                         | Local  | The grant type for OAuth, which is "authorization_code" for this flow.                                   |
| `OAUTH_CLIENT_ID`        | (string)                                       | Local  | The client ID provided by 42's API.                                                                      |
| `OAUTH_SECRET`           | (string)                                       | Local  | The secret associated with the OAuth application.                                                        |


## OAUTH configuration

This project is using Google remote sign-in oauth.

Documentation: https://developers.google.com/identity/protocols/oauth2?hl=fr

## ⚠️ Important

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.