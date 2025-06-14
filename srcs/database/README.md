# SARIF Database

This document provides information about the database's API.

- [HTTP Headers](#http-headers)
- [`GET`](#get)
- [`POST`](#post)
- [`DELETE`](#delete)
- [`PUT`](#put)
- [Tables and values](#tables-and-values)

# HTTP Headers

A few fields are required for the database to accept ANY request (GET, POST, DELETE and PUT).

| Key             | Expected value                      | Description                                             |
| --------------- | ----------------------------------- | ------------------------------------------------------- |
| `Authorization` | whatever `node.env.API_KEY` returns | The global, build-time defined API key used internally. |
| `Content-Type`  | `application/json`                  | `POST` and `PUT` only. Any other type will be rejected. |

# `GET`

**Valid table(s): `Players`, `Matches` and `OAuth`**

`GET` is used to retrieve a row from any of the tables of the database.

## `GET` requires additional headers to function:

| Key            | Example values                       | Description                     |
| -------------- | ------------------------------------ | ------------------------------- |
| `field`        | `PlayerID`, `MatchID`, `DisplayName` | The field containing the query  |
| `query`        | the `field`'s corresponding type.    | The search query                |

## `GET` can return the following codes:

| Return Code                 | Return Content          | Condition                                            |
| --------------------------- | ----------------------- | ---------------------------------------------------- |
| `200 OK`                    | JSON Object             | The requested value was found.                       |
| `400 Bad Request`           | `error.missing.field`   | The request did not include all the required fields. |
| `400 Bad Request`           | `error.invalid.field`   | The request had an incorrect search field.           |
| `400 Bad Request`           | `error.missing.query`   | The request did not include a query.                 |
| `401 Unauthorized`          | `error.missing.api_key` | The request was missing the API key.                 |
| `401 Unauthorized`          | `error.invalid.api_key` | The request contained an invalid API key.            |
| `404 Not Found`             | `error.value.notfound`  | The requested value could not be found.              |
| `500 Internal Server Error` | a lot of things!        | Uhhh can you screenshot and DM me the logs plz? ty   |

# `POST`

**Valid table(s): `Players`, `Matches`, `OAuth` and `CurrentContract`**

`POST` is used to create a new entry in one of the tables. For updating already existing entries, please use `PUT` instead. **`POST` requires a valid `application/json` body. Every absent field will automatically be set to NULL.**

In order to use POST, please refer to the table list below to know which information must be present during a request.

- [Players](#players)
- [Matches](#matches)
- [OAuth](#oauth)
- [CurrentContract](#currentcontract)

## `POST` can return one of the following:

| Return Code                 | Return Content               | Condition                                                                                     |
| --------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| `201 Created`               | JSON Object                  | The request was completed and inserted into the table.                                        |
| `400 Bad Request`           | `error.invalid.content-type` | The request's content was not `application/json`.                                             |
| `400 Bad Request`           | `error.missing.entries`      | The request was missing one or more of the required fields. DM me if this happens tho         |
| `400 Bad Request`           | `error.missing.fields`       | The request did not include all of the required fields.                                       |
| `401 Unauthorized`          | `error.missing.api_key`      | The request was missing the API key.                                                          |
| `401 Unauthorized`          | `error.invalid.api_key`      | The request contained an invalid API key.                                                     |
| `409 Conflict`              | `error.uuid.exists`          | The request SOMEHOW contained a colliding UUID which already was in the table.                |
| `409 Conflict`              | `error.nameid.exists`        | The request contained an already existing `DisplayName` (Only valid for the `Players` table.) |
| `500 Internal Server Error` | `error.database.fucked`      | i DONT KNOW how you got there. Send me a screenshot of the issue.                             |
| `500 Internal Server Error` | a lot of things!             | Uhhh can you screenshot and DM me the logs plz? ty                                            |

# `DELETE`

**Valid table(s): `Players` and `OAuth`**

`DELETE` is used to, well, delete a row from a table.

## `DELETE` requires additional headers to function:

| Key            | Example values                       | Description                                 |
| -------------- | ------------------------------------ | ------------------------------------------- |
| `field`        | `PlayerID`, `MatchID`, `DisplayName` | The field containing the query              |
| `query`        | the `field`'s corresponding type.    | The query containing the item to be deleted |

## `DELETE` can return the following codes:

| Return Code                 | Return Content            | Condition                                            |
| --------------------------- | ------------------------- | ---------------------------------------------------- |
| `202 Accepted`              | `SQLite`'s result.        | The requested value was deleted.                     |
| `400 Bad Request`           | `error.missing.field`     | The request did not include all the required fields. |
| `400 Bad Request`           | `error.invalid.field`     | The request had an incorrect field.                  |
| `400 Bad Request`           | `error.missing.query`     | The request did not include a query.                 |
| `401 Unauthorized`          | `error.missing.api_key`   | The request was missing the API key.                 |
| `401 Unauthorized`          | `error.invalid.api_key`   | The request contained an invalid API key.            |
| `404 Not Found`             | `error.value.notfound`    | The requested value could not be found.              |
| `500 Internal Server Error` | a lot of things!          | Uhhh can you screenshot and DM me the logs plz? ty   |

# `PUT`

**Valid table(s): `Players` and `OAuth`**

`PUT` is used to update a row. It can contain multiple fields to update in one go.
`PUT` requires a valid `<table>ID` to update, as well as any additional fields which need to be changed. Refer to [Tables and values](#tables-and-values) to know which fields are applicable.

## `PUT` can return the following codes:

| Return Code                 | Return Content            | Condition                                            |
| --------------------------- | ------------------------- | ---------------------------------------------------- |
| `202 Accepted`              | `SQLite`'s result.        | The requested value was deleted.                     |
| `400 Bad Request`           | `error.missing.fields`    | The request did not include fields to modify.        |
| `400 Bad Request`           | `error.invalid.field`     | The request had an incorrect field.                  |
| `401 Unauthorized`          | `error.missing.api_key`   | The request was missing the API key.                 |
| `401 Unauthorized`          | `error.invalid.api_key`   | The request contained an invalid API key.            |
| `404 Not Found`             | `error.value.notfound`    | The requested value could not be found.              |
| `500 Internal Server Error` | a lot of things!          | Uhhh can you screenshot and DM me the logs plz? ty   |


# Tables and values

In order to perform an operation on a table, you must perform your HTTP request using the table's name as route (case-sensitive.)
eg. `PUT /Players` will perform an update on the Players table.
**If you attempt a request on an unsupported table, you will get a Fastify 404 error.**

## Players:

| Field          | Type             | Required | Example                                    | Description                                                           |
| -------------- | ---------------- | -------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `PlayerID`     | UUIDv4 String    | Ignored  | `P-f4d122ff-c1b1-4f69-a04d-e63044a3b052`   | The player's Unique Identifier (created with uuidv4();).              |
| `DisplayName`  | String           | Yes      | `Broller`                                  | The player's display name.                                            |
| `EmailAddress` | String           | Yes      | `fclivaz@email.com`                        | The player's email address.                                           |
| `PassHash`     | String           | Yes      | `d1aa1db20f1ec7ec04c12e1bc5b5f01c653543b4` | The player's hashed password.                                         |
| `OAuthID`      | String or NULL   | No       | `f5242535f238ecfeff5df5938e26d2a3257c1676` | The player's OAuth2 SubjectID, cross-referenced from the OAuth table. |
| `FriendsList`  | Array of Strings | No       |`["98123nd", "asdd928ansdko", "chjdfud2"]` | The player's friends list (mine is empty)                             |
| `PhoneNumber`  | String or NULL   | No       |`00411234567890`                           | The player's phone number.                                            |
| `FirstName`    | String or NULL   | No       |`Rui`                                      | The player's real name.                                               |
| `FamilyName`   | String or NULL   | No       |`De Jesus Ferreira`                        | The player's family name.                                             |
| `Bappy`        | Integer or NULL  | No       | `1745023412`                               | The player's birth date, in UNIX timestamp.                           |
| `Admin`        | Integer or NULL  | No       | `0` or `1`                                 | Whether or not the player is an admin.                                |

## Matches:

| Field            | Type          | Required | Example                                  | Description                                                                                                               |
| ---------------- | ------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `MatchID`        | UUIDv4 String | Ignored  | `M-1f45a30c-8818-4584-87f1-9192e08fbb2a` | The match's Unique Identifier (created with uuidv4();).                                                                   |
| `PlayerOneID`    | UUIDv4 String | Yes      | `P-83157b37-f452-46b6-8aea-65df4d03683a` | The 1st player's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL. |
| `PlayerTwoID`    | UUIDv4 String | Yes      | `P-114cb650-b711-4c01-8f98-e2f7b44f6d8d` | The 2nd player's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL. |
| `WinnerPlayerID` | UUIDv4 String | Yes      | `P-83157b37-f452-46b6-8aea-65df4d03683a` | The winner's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL.     |
| `ScoreOne`       | Integer       | Yes      | 12                                       | The 1st player's score.                                                                                                   |
| `ScoreTwo`       | Integer       | Yes      | 1                                        | The 2nd player's score.                                                                                                   |
| `StartTime`      | Integer       | Yes      | 1745023412                               | The start time of the game, in UNIX timestamp.                                                                            |
| `EndTime`        | Integer       | Yes      | 1745023511                               | The end time of the game, in UNIX timestamp.                                                                              |
| `MatchIndex`     | Integer       | TBD      | 4                                        | The Blockchain index of the match.                                                                                        |

## Oauth:

| Field            | Type    | Required | Example                                | Description                                      |
| ---------------- | ------- | -------- | -------------------------------------- | ------------------------------------------------ |
| `SubjectID`      | String  | Yes      | `jas089du2jmdp-a9s8daje3uhdc-a0sidja5` | The Subject ID provided by the Issuer.           |
| `IssuerName`     | String  | Yes      | `Google`                               | The name of the issuer.                          |
| `EmailAddress`   | String  | Yes      | `Rude-jes@email.com`                   | The email address of the user.                   |
| `FullName`       | String  | No       | `Jean-Richard Bergmann`                | The full legal name of the user.                 |
| `FirstName`      | String  | No       | `Jean-Richard`                         | The first name of the user.                      |
| `FamilyName`     | String  | No       | `Bergmann`                             | The last name of the user.                       |
| `TokenHash`      | String  | Yes      | `87q09we8aysgbdipoauwhe98q280qujeasoi` | The hashed token.                                |
| `IssueTime`      | Integer | Yes      | 1745023412                             | The UNIX time when the OAuth session was issued. |
| `ExpirationTime` | Integer | No       | 1745023511                             | The UNIX time at which the session expires.      |

## UIDTable

NOTE: UIDTable is internal. There are no available routes to modify it.

| Field            | Type          | Example                                  | Description                            |
| ---------------- | ------------- | ---------------------------------------- | -------------------------------------- |
| `UID`            | UUIDv4 String | `M-1f45a30c-8818-4584-87f1-9192e08fbb2a` | Any UUIDv4 generated during insertion. |

## CurrentContract

NOTE: the `POST` request on CurrentContract does not need any information. You can send an empty body.

| Field             | Type          | Example                                  | Description                                           |
| ----------------- | ------------- | ---------------------------------------- | ----------------------------------------------------- |
| `ContractAddress` | Hashed String | `0x98sdy9hqn32ieahsodiajosd8u0pq3ioj9oa` | The SmartContract generated by the Blockchain module. |
