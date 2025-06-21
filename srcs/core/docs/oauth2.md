# SARIF Oauth2

This document provides information about the external Oauth2 module's API used for authentication via provider's OAuth service.

---

- [`GET /login`](#get-login)
- [`GET /callback`](#get-callback)

# 🔐 Overview

This module lets users log in using their provider account. It does that by redirecting users to provider’s login page and then getting an access token from provider after they log in.

## Flow usage

![OAuth2 Diagram](./docs/OAuth2.scheme.drawio.svg)

# Endpoints

## `GET /login`

Gets the URL to redirect the user to the provider's OAuth authorization server and it's state identifier to use with `GET /sessions/:state` endpoint (from internal module).

### HTTP Queries

| Query        | Required | Example  | Description                                                                      |
| ------------ | -------- | -------- | -------------------------------------------------------------------------------- |
| `?client_id` | yes      | (string) | Identify the client, so newer states will force older ones to close.             |

The `client_id` can be any unique id value as long as the client (browser) can be identified by it.

### Response:

| Return Code        | Description                                       |
| ------------------ | -----------------------------------------------   |
| `200 OK`           | The login URL to redirect the user.               |
| `400 Bad Request`  | Missing some headers, queries or parameters.      |
| `401 Unauthorized` | Authorization header does not comply with API_KEY |

#### Example Response:

```json
{
  "url":"https://accounts.google.com/o/oauth2/v2/auth?client_id=someid.apps.googleusercontent.com&redirect_uri=someurl&scope=openid+email+profile&response_type=code",
  "state": "30b61560-4d5..."
}
```

## `GET /callback`

On the `core` module, this endpoint will catch the provider's OAuth callback after the user has logged in and updates/creates the user.

It will then return the JWT access token for the user to authenticate with our APIs.

This endpoint handles the callback from provider's OAuth server. It expects a `code` in the query string and will return an access token.

Token can also be fetched using `GET /sessions/:state` endpoint for a more simple usage.

### HTTP Queries

| Query    | Required | Example  | Description                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| `?code`  | yes      | (string) | The code provided by the user login callback  |
| `?state` | yes      | (string) | The state provided by the user login callback |

### Required Query Parameters:

| Key   | Example         | Description                             |
| ----- | --------------- | --------------------------------------- |
| `code`| (string)        | The code returned by the OAuth server.  |

### Response:
             
| Return Code                 | Condition                                                           |
| --------------------------- | ------------------------------------------------------------------- |
| `303 See Other`             | Successfully retrieved the access token. Redirects to the frontend. |
| `400 Bad Request`           | Missing some headers, queries or parameters.                        |
| `401 Unauthorized`          | Authorization header does not comply with API_KEY                   |
| `404 Not Found`             | Requested state id was not found, probably timed out.               |
| `500 Internal Server error` | Something went wrong during the token request process.              |

#### Example Response:

Simply redirects to the frontend with token added to cookies.

## OAUTH configuration

This project is using Google remote sign-in oauth by default, it may break with another provider.

Documentation: https://developers.google.com/identity/protocols/oauth2?hl=fr

## ⚠️ Important

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.