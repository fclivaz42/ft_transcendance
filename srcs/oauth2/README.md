# SARIF Oauth2

This document provides information about the internal Oauth2 module's API used for authentication via 42's OAuth service.

> ⚠️ This is for **internal use only**. Do not expose it publicly.

---

- [HTTP Headers](#http-headers)
- [`GET /login`](#get-login)
- [`GET /callback`](#get-callback)
- [Environment Variables](#environment-variables)

# 🔐 Overview

This module lets users log in using their 42 account. It does that by redirecting users to 42’s login page and then getting an access token from 42 after they log in.

# HTTP Headers

⚠️ Although not yet implemented, the following header **will be required in future versions**.

| Key       | Expected value               | Description                                             |
| --------- | ---------------------------- | ------------------------------------------------------- |
| `api_key` | whatever `node.env.API_KEY` returns | The global, build-time defined API key used internally. |

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
| `200 OK`                    | `{ "access_token": "..." }`           | Successfully retrieved the access token.               |
| `400 Bad Request`           | `Error: Missing code query`           | The request was missing the `code` query param.        |
| `500 Internal Server Error` | `Error: couldn't fetch access_token`  | Something went wrong during the token request process. |

#### Example Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

# Environment Variables

These variables are defined in the `.env` file and used for configuration.

| Variable           | Example Value                               | Description                                                           |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------- |
| `OAUTH_LOGGER`     | `true`                                      | Enables or disables logging for the OAuth module.                     |
| `OAUTH_PORT`       | `3000`                                      | The port the OAuth server listens on.                                 |
| `OAUTH_CALLBACK`   | `http://127.0.0.1:3000/oauth/callback`       | The callback URL where the OAuth server redirects users after login. (⚠️ see notes at the end of README) |
| `OAUTH_SERVER`     | `https://api.intra.42.fr/oauth`             | The base URL of 42’s OAuth server.                                    |
| `OAUTH_CLIENT_ID`  | (string)                                    | The client ID provided by 42's API.                                   |
| `OAUTH_SECRET`     | (string)                                    | The secret associated with the OAuth client.                          |

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.