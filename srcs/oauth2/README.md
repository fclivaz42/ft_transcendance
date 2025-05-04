# SARIF Oauth2

This document provides information about the internal Oauth2 module's API used for authentication via provider's OAuth service.

> ⚠️ This is for **internal use only**. Do not expose it publicly.

---

- [`GET /login`](#get-login)
- [`GET /callback`](#get-callback)
- [`GET /sessions/:state`](#get-sessionsstate)
- [Environment Variables](#environment-variables)

# 🔐 Overview

This module lets users log in using their provider account. It does that by redirecting users to provider’s login page and then getting an access token from provider after they log in.

## Flow usage

![OAuth2 Diagram](./docs/OAuth2.scheme.drawio.svg)

# Endpoints

## `GET /login`

Gets the URL to redirect the user to the provider's OAuth authorization server and it's state identifier to use with `GET /sessions/:state` endpoint

### HTTP Queries

| Query     | Required | Example  | Description                                                          |
| --------- | -------- | -------- | -------------------------------------------------------------------- |
| ?clientid | yes      | (string) | Identify the client, so newer states will force older ones to close. |

The clientid can be anything as long as the client (browser) can be identified (a cookie perhaps ?)

### HTTP Headers

| Key             | Required  | Expected value                         | Description                                             |
| --------------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| `authorization` | yes       | whatever `process.env.API_KEY` returns | The global, build-time defined API key used internally. |

### Response:

| Return Code        | Return Content                         | Description                                       |
| ------------------ | -------------------------------------- | -----------------------------------------------   |
| `200 OK`           | `{ "url": "..." }`                     | The login URL to redirect the user.               |
| `401 Unauthorized` | `error: Unauthorized`                  | Authorization header does not comply with API_KEY |

#### Example Response:

```json
{
	"url":"https://accounts.google.com/o/oauth2/v2/auth?client_id=someid.apps.googleusercontent.com&redirect_uri=someurl&scope=openid+email+profile&response_type=code",
	"state": "30b61560-4d5..."
}
```

## `GET /callback`

Fetch and return the access token from user.

This endpoint handles the callback from Procider's OAuth server. It expects a `code` in the query string and will return an access token.

Token can also be fetched using `GET /sessions/:state` endpoint for a more simple usage.

### HTTP Queries

| Query  | Required | Example  | Description                                   |
| ------ | -------- | -------- | --------------------------------------------- |
| ?code  | yes      | (string) | The code provided by the user login callback  |
| ?state | yes      | (string) | The state provided by the user login callback |

### HTTP Headers

| Key             | Required  | Expected value                         | Description                                             |
| --------------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| `authorization` | yes       | whatever `process.env.API_KEY` returns | The global, build-time defined API key used internally. |


### Required Query Parameters:

| Key   | Example         | Description                             |
| ----- | --------------- | --------------------------------------- |
| `code`| (string)        | The code returned by the OAuth server.  |

### Response:

| Return Code                 | Return Content                       | Condition                                              |
| --------------------------- | ------------------------------------ | ------------------------------------------------------ |
| `200 OK`                    | `{ "access_token": "...", ... }`     | Successfully retrieved the access token.               |
| `401 Unauthorized`          | `error: Unauthorized`                | Authorization header does not comply with API_KEY      |
| `500 Internal Server error` | `error: couldn't fetch access_token` | Something went wrong during the token request process. |

#### Example Response:

> jwt_decode will only be present if the used OAuth service is google

> Note that jwt_decode.subject can be used as a google account identifier


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

## `GET /sessions/:state`

Gets the session status. Sessions have a storage limit of 500 elements; once it's reached, oldest states will be deleted.

### HTTP Params

| Param   | Required | Example  | Description                       |
| ------- | -------- | -------- | --------------------------------- |
| :state  | yes      | (string) | The state id provided by callback |


### HTTP Headers

| Key             | Required  | Expected value                         | Description                                             |
| --------------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| `authorization` | yes       | whatever `process.env.API_KEY` returns | The global, build-time defined API key used internally. |

### Response:

| Return Code        | Return Content                                                                                           | Description                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `200 OK`           | `{ "state": "r3fjf...", "clientid": "f233...", ...`                                                      | Temporary session status and it's token.           |
| `202 Accepted`     | `{ statusCode: 202, message: "Session is still being processed"}`                                        | The user didn't logged in yet.                     |
| `401 Unauthorized` | `{ statusCode: 401, error: "Unauthorized", message: "You are not authorized to access this ressource" }` | Authorization header does not comply with API_KEY. |
| `404 Not Found`    | `{ statusCode: 404, error: "Not Found", message: "Session not found" }`                                  | Session was not found, you can delete this state.  |

#### Example Response:

```json
{
	"state": "8fed1ef7-2a51-402b-a901-b83e1872ed50",
	"clientid": "unique_id",
	"logged": true,
	"token": {
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
| `OAUTH_CLIENT_ID`        | (string)                                       | Local  | The client ID provided by the OAuth service.                                                             |
| `OAUTH_SECRET`           | (string)                                       | Local  | The secret associated with the OAuth client id.                                                          |


## OAUTH configuration

This project is using Google remote sign-in oauth.

Documentation: https://developers.google.com/identity/protocols/oauth2?hl=fr

## ⚠️ Important

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.