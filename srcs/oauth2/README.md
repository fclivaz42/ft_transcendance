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
  "url": "https://api.intra.42.fr/oauth/authorize?client_id=YOUR_CLIENT_ID&callback_uri=http://127.0.0.1:3000/oauth/callback&response_type=code"
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
```json
{
  "access_token": "d67b7a7...",
  "token_type": "bearer",
  "expires_in": 7092,
  "scope": "public",
  "created_at": 1746294668,
  "secret_valid_until": 1748616213
}
```

# Environment Variables

These variables are defined in the `.env` file and used for configuration.

| Variable           | Example Value                               | Scope  | Description                                                                                              |
| ------------------ | ------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `API_KEY`          | (string)                                    | Global | The key to authorize sensitive endpoints                                                                 |
| `OAUTH_LOGGER`     | `true`                                      | Local  | Enables or disables logging for the OAuth module.                                                        |
| `OAUTH_PORT`       | `3000`                                      | Local  | The port the OAuth server listens on.                                                                    |
| `OAUTH_CALLBACK`   | `http://127.0.0.1:3000/oauth/callback`      | Local  | The callback URL where the OAuth server redirects users after login. (⚠️ see notes at the end of README) |
| `OAUTH_SERVER`     | `https://api.intra.42.fr/oauth`             | Local  | The base URL of 42’s OAuth server.                                                                       |
| `OAUTH_CLIENT_ID`  | (string)                                    | Local  | The client ID provided by 42's API.                                                                      |
| `OAUTH_SECRET`     | (string)                                    | Local  | The secret associated with the OAuth client.                                                             |

## OUATH_CLIENT_ID and OAUTH_SECRET

They are generated through https://profile.intra.42.fr/oauth/applications

## ⚠️ Important

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.