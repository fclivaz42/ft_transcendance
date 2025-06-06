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
| `?user_id`   | no       | (string) | The user id to use for the session, if not provided a new one will be generated. |

The `client_id` can be any unique id value as long as the client (browser) can be identified by it.
The `user_id` is optional, if not provided a new user id will be generated for the session. It is not implemented yet.

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

Fetch and return the access token from user.

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

| Return Code                 | Condition                                              |
| --------------------------- | ------------------------------------------------------ |
| `200 OK`                    | Successfully retrieved the access token.               |
| `400 Bad Request`           | Missing some headers, queries or parameters.           |
| `401 Unauthorized`          | Authorization header does not comply with API_KEY      |
| `404 Not Found`             | Requested state id was not found, probably timed out.  |
| `500 Internal Server error` | Something went wrong during the token request process. |

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

## OAUTH configuration

This project is using Google remote sign-in oauth by default, it may break with another provider.

Documentation: https://developers.google.com/identity/protocols/oauth2?hl=fr

## ⚠️ Important

> ⚠️ The default `OAUTH_CALLBACK` is set to `http://127.0.0.1:3000/oauth/callback` for local development. You'll need to change it to a public URL later in production, by redirecting it to the core server.