# SARIF Usermanager

This document provides information about the internal Usermanager module's API used for user authentication and management.

> ⚠️ This is for **internal use only**. Do not expose it publicly.

---
# Table of Contents
- [`GET /users/authorize`](#get-users-authorize)
- [`GET /users/me`](#get-users-me)
- [`POST /users/login`](#get-users-login)
- [`POST /users/register`](#get-users-login)
- [`POST /users/oauthLogin`](#get-users-login)
- [`GET /users/:uuid`](#get-users-uuid)
- [`POST /users`](#post-users)
- [`PUT /users/:uuid`](#put-users-uuid)

- [Environment Variables](#environment-variables)

# 🔐 Overview

This module is responsible for handling user management for the SARIF project, including user authentication and authorization using JWT tokens.

# Endpoints

## `GET /users/me`
Returns the current user's information based on the provided JWT token.

### Cookies
| Key             | Required  | Expected value | Description                                      |
| --------------- | --------- | -------------- | ------------------------------------------------ |
| `token`         | yes       | `{jwtToken}`   | User jwt token to authorize ~~authenticate~~ him |

### Response example:

```json
{
  "PlayerID": "P-e643426b-8a3f-43b9-85ab-7a3816874efa",
  "DisplayName": "ruipaulo@outlook.fr",
  "EmailAddress": "ruipaulo@outlook.fr",
  "FriendsList": null,
  "PhoneNumber": null,
  "FirstName": null,
  "FamilyName": null,
  "Bappy": null,
  "Admin": 0
}
```

## `GET /users/:uuid`
Returns the user information for the specified UUID.

If the user is self, it will return the same information as `GET /users/me`.

### Cookies
| Key             | Required  | Expected value | Description                                      |
| --------------- | --------- | -------------- | ------------------------------------------------ |
| `token`         | yes       | `{jwtToken}`   | User jwt token to authorize ~~authenticate~~ him |

### Response example:

```json
{
  "PlayerID": "P-55dd4c07-6976-4474-b91a-a81d9b260b7a",
  "DisplayName": "user",
  "Admin": 0
}
```

## `PUT /users/update`
Updates the current user's information based on the provided JWT token.

### Cookies
| Key             | Required  | Expected value | Description                                      |
| --------------- | --------- | -------------- | ------------------------------------------------ |
| `token`         | yes       | `{jwtToken}`   | User jwt token to authorize ~~authenticate~~ him |

### Body Parameters:
same as `GET /users/me` response, except `PlayerID` is not required.
can include `Password` to update the user's password.

## `GET /users/authorize`
Validates the user's JWT token and returns the user information if valid.

### Cookies
| Key             | Required  | Expected value | Description                                      |
| --------------- | --------- | -------------- | ------------------------------------------------ |
| `token`         | yes       | `{jwtToken}`   | User jwt token to authorize ~~authenticate~~ him |

### Response:

| Return Code        | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `200 OK`           | Decoded JWT token with user information.              |
| `400 Bad Request`  | Missing some headers, queries or parameters.          |
| `401 Unauthorized` | Authorization header is not valid                     |
| `403 Forbidden`    | User is not authenticated, or JWT token is not valid. |

#### Example Response:

```json
{
  "sub": "57678311c4f3614283f2deafb13a53a20838f03f9da2a9aad199bb3fd76f7da7",
  "data": {},
  "iss": "sarif.usermanager",
  "iat": 1748636772,
  "exp": 1748640372
}
```

##### Description of the response fields:

| Field  | Type   | Description                                                                            |
| ------ | ------ | -------------------------------------------------------------------------------------- |
| `sub`  | string | The unique identifier for the user, typically a hash of their user ID.                 |
| `data` | object | Additional user data, which may include roles, permissions, or other info.             |
| `iss`  | string | The issuer of the JWT, indicating the source of the token (e.g., "sarif.usermanager"). |
| `iat`  | number | The timestamp when the JWT was issued, in seconds since the epoch.                     |
| `exp`  | number | The expiration timestamp of the JWT, in seconds since the epoch.                       |


## `POST /users/login`

### Body Parameters:
*Note*: The EmailAddress and DisplayName are both exclusive, only one is required.

```json
{
  "DisplayName": "username",
  "EmailAddress": "email@test.com",
  "Password": "password",
}
```

### Example Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMDZmNWEzMDY2NDAxYmMyM2M3Mzk2YmYzNzc3NTYwNzQzOWZkZTU1OGIxYzg0YmJmMzhiOWM1ZWY5NmE5Njk1IiwiZGF0YSI6eyJzb21lc3RyaW5nIjoiTm90IG5lY2Vzc2FyeSBidXQgeW91IGNhbiBwYXNzIG5vbi1jcml0aWNhbC1zZW5zaXRpdmUgZGF0YSBoZXJlIGlmIG5lZWRlZCwgb3IgZW5jcnlwdCBpdCB5b3Vyc2VsZiJ9LCJpc3MiOiJzYXJpZi51c2VybWFuYWdlciIsImlhdCI6MTc0ODYzODA5MCwiZXhwIjoxNzQ4NjQxNjkwfQ.x-TuwPkHt3aWFPRZ9omUjlU0qgebNA7QDtqER-fuPD8",
  "sub": "p-c0f6a53066401bc23c7396bf37775607439fde5581b8c4bbf38b9c5ef96a9695",
  "data": {},
  "iss": "sarif.usermanager",
  "iat": 1748638090,
  "exp": 1748641690
}
```

##### Description of the response fields:

| Field   | Type   | Description                                                                |
| ------- | ------ | -------------------------------------------------------------------------- |
| `token` | string | The JWT token that the user can use for subsequent authenticated requests. |

## `POST /users/register`

### Body Parameters:

```json
{
  "DisplayName": "username",
  "EmailAddress": "email@test.com",
  "Password": "password",
}
```

### Example Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMDZmNWEzMDY2NDAxYmMyM2M3Mzk2YmYzNzc3NTYwNzQzOWZkZTU1OGIxYzg0YmJmMzhiOWM1ZWY5NmE5Njk1IiwiZGF0YSI6eyJzb21lc3RyaW5nIjoiTm90IG5lY2Vzc2FyeSBidXQgeW91IGNhbiBwYXNzIG5vbi1jcml0aWNhbC1zZW5zaXRpdmUgZGF0YSBoZXJlIGlmIG5lZWRlZCwgb3IgZW5jcnlwdCBpdCB5b3Vyc2VsZiJ9LCJpc3MiOiJzYXJpZi51c2VybWFuYWdlciIsImlhdCI6MTc0ODYzODA5MCwiZXhwIjoxNzQ4NjQxNjkwfQ.x-TuwPkHt3aWFPRZ9omUjlU0qgebNA7QDtqER-fuPD8",
  "sub": "p-c0f6a53066401bc23c7396bf37775607439fde5581b8c4bbf38b9c5ef96a9695",
  "data": {},
  "iss": "sarif.usermanager",
  "iat": 1748638090,
  "exp": 1748641690
}
```

##### Description of the response fields:

| Field   | Type   | Description                                                                |
| ------- | ------ | -------------------------------------------------------------------------- |
| `token` | string | The JWT token that the user can use for subsequent authenticated requests. |

## `POST /users/oathLogin`

### Body Parameters:
```json
{
  "OAuthID": "5453jdskd343552...",
}
```

### Example Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMDZmNWEzMDY2NDAxYmMyM2M3Mzk2YmYzNzc3NTYwNzQzOWZkZTU1OGIxYzg0YmJmMzhiOWM1ZWY5NmE5Njk1IiwiZGF0YSI6eyJzb21lc3RyaW5nIjoiTm90IG5lY2Vzc2FyeSBidXQgeW91IGNhbiBwYXNzIG5vbi1jcml0aWNhbC1zZW5zaXRpdmUgZGF0YSBoZXJlIGlmIG5lZWRlZCwgb3IgZW5jcnlwdCBpdCB5b3Vyc2VsZiJ9LCJpc3MiOiJzYXJpZi51c2VybWFuYWdlciIsImlhdCI6MTc0ODYzODA5MCwiZXhwIjoxNzQ4NjQxNjkwfQ.x-TuwPkHt3aWFPRZ9omUjlU0qgebNA7QDtqER-fuPD8",
  "sub": "p-c0f6a53066401bc23c7396bf37775607439fde5581b8c4bbf38b9c5ef96a9695",
  "data": {},
  "iss": "sarif.usermanager",
  "iat": 1748638090,
  "exp": 1748641690
}
```

##### Description of the response fields:

| Field   | Type   | Description                                                                |
| ------- | ------ | -------------------------------------------------------------------------- |
| `token` | string | The JWT token that the user can use for subsequent authenticated requests. |

# Environment Variables
These variables are defined in the `.env` file and used for configuration.

The only mandatory variable is `API_KEY`, which is used to authorize sensitive endpoints. The other variables are optional and can be set based on the module's requirements.

- **Global scope**: the environment variable should be defined in the root (global) `.env` file, shared across multiple modules.
- **Local scope**: the environment variable is specific to this module and should be defined in its local `.env` file.

| Variable                 | Example Value                                  | Scope  | Description                                                        |
| ------------------------ | ---------------------------------------------- | ------ | ------------------------------------------------------------------ |
| `API_KEY`                | (string)                                       | Global | The key to authorize sensitive endpoints                           |
