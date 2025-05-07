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

| Key            | Expected value                      | Description                                             |
| -------------- | ----------------------------------- | ------------------------------------------------------- |
| `api_key`      | whatever `node.env.API_KEY` returns | The global, build-time defined API key used internally. |
| `Content-Type` | `application/json`                  | `POST` and `PUT` only. Any other type will be rejected. |

# `GET`

**Valid table(s): `Players` and `Matches`.**

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

**Valid table(s): `Players` and `Matches`.**

`POST` is used to create a new entry in one of the tables. For updating already existing entries, please use `PUT` instead.

## `POST` requires a valid `application/json` body. Every field must be present.

### If the table is `Players`:

| Field          | Type           | Example                                    | Description                                                                   |
| -------------- | -------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| `PlayerID`     | UUIDv4 String  | `f4d122ff-c1b1-4f69-a04d-e63044a3b052`     | The player's Unique Identifier (created with uuidv4();).                      |
| `DisplayName`  | String         | `Broller`                                  | The player's display name.                                                    |
| `PassHash`     | Hashed String  | `d1aa1db20f1ec7ec04c12e1bc5b5f01c653543b4` | The player's hashed password.                                                 |
| `ActiveTokens` | String         | `f5242535f238ecfeff5df5938e26d2a3257c1676` | The player's active tokens. Set to the string `NULL` if empty.                |
| `EmailAddress` | String         | `fclivaz@email.com`                        | The player's email address.                                                   |
| `PhoneNumber`  | String         | `00411234567890`                           | The player's phone number.                                                    |
| `RealName`     | String         | `Rui`                                      | The player's real name.                                                       |
| `Surname`      | String         | `De Jesus Ferreira`                        | The player's surname.                                                         |
| `Bappy`        | Integer        | `1745023412`                               | The player's birth date, in UNIX timestamp.                                   |
| `Admin`        | Integer        | `0` or `1`                                 | Whether or not the player is an admin. You **MIGHT** want to set this to 0 :) |

### If the table is `Matches`:

| Field            | Type          | Example                                | Description                                             |
| ---------------- | ------------- | -------------------------------------- | ------------------------------------------------------- |
| `MatchID`        | UUIDv4 String | `1f45a30c-8818-4584-87f1-9192e08fbb2a` | The match's Unique Identifier (created with uuidv4();). |
| `PlayerOneID`    | UUIDv4 String | `83157b37-f452-46b6-8aea-65df4d03683a` | The 1st player's UUIDv4, cross-referenced from Players. |
| `PlayerTwoID`    | UUIDv4 String | `114cb650-b711-4c01-8f98-e2f7b44f6d8d` | The 2nd player's UUIDv4, cross-referenced from Players. |
| `WinnerPlayerID` | UUIDv4 String | `83157b37-f452-46b6-8aea-65df4d03683a` | The winner's UUIDv4, cross-referenced from Players.     |
| `ScoreOne`       | Integer       | 12                                     | The 1st player's score.                                 |
| `ScoreTwo`       | Integer       | 1                                      | The 2nd player's score.                                 |
| `StartTime`      | Integer       | 1745023412                             | The start time of the game, in UNIX timestamp.          |
| `EndTime`        | Integer       | 1745023511                             | The end time of the game, in UNIX timestamp.            |

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

**Valid table(s): `Players`**

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

**Valid table(s): `Players`**

`PUT` is used to update a row It can contain multiple fields to update in one go.
`PUT` requires a valid `PlayerID` to update, as well as any additional fields which need to be changed. Refer to [Tables and values](#tables-and-values) to know which fields are applicable.

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

The database contains two tables. In order to perform an operation on a table, you must perform your HTTP request using the table's name as route (case-sensitive.)
eg. `PUT /Players` will perform an update on the Players table.
**If you attempt a request on an unsupported table, you will get a Fastify 404 error.**

## Players:

| Field          | Type            | Example                                    | Description                                                                     |
| -------------- | --------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| `PlayerID`     | UUIDv4 String   | `f4d122ff-c1b1-4f69-a04d-e63044a3b052`     | The player's Unique Identifier (created with uuidv4();).                        |
| `DisplayName`  | String          | `Broller`                                  | The player's display name.                                                      |
| `PassHash`     | String          | `d1aa1db20f1ec7ec04c12e1bc5b5f01c653543b4` | The player's hashed password.                                                   |
| `ActiveTokens` | String or NULL  | `f5242535f238ecfeff5df5938e26d2a3257c1676` | The player's active tokens. This field can be NULL if the player has no tokens. |
| `EmailAddress` | String          | `fclivaz@email.com`                        | The player's email address.                                                     |
| `PhoneNumber`  | String          | `00411234567890`                           | The player's phone number.                                                      |
| `RealName`     | String          | `Rui`                                      | The player's real name.                                                         |
| `Surname`      | String          | `De Jesus Ferreira`                        | The player's surname.                                                           |
| `Bappy`        | Integer         | `1745023412`                               | The player's birth date, in UNIX timestamp.                                     |
| `Admin`        | Integer or NULL | `0` or `1`                                 | Whether or not the player is an admin.                                          |

## Matches:

| Field            | Type          | Example                                | Description                                                                                                               |
| ---------------- | ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `MatchID`        | UUIDv4 String | `1f45a30c-8818-4584-87f1-9192e08fbb2a` | The match's Unique Identifier (created with uuidv4();).                                                                   |
| `PlayerOneID`    | UUIDv4 String | `83157b37-f452-46b6-8aea-65df4d03683a` | The 1st player's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL. |
| `PlayerTwoID`    | UUIDv4 String | `114cb650-b711-4c01-8f98-e2f7b44f6d8d` | The 2nd player's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL. |
| `WinnerPlayerID` | UUIDv4 String | `83157b37-f452-46b6-8aea-65df4d03683a` | The winner's UUIDv4, cross-referenced from Players. If the Player is deleted, this will be automatically set to NULL.     |
| `ScoreOne`       | Integer       | 12                                     | The 1st player's score.                                                                                                   |
| `ScoreTwo`       | Integer       | 1                                      | The 2nd player's score.                                                                                                   |
| `StartTime`      | Integer       | 1745023412                             | The start time of the game, in UNIX timestamp.                                                                            |
| `EndTime`        | Integer       | 1745023511                             | The end time of the game, in UNIX timestamp.                                                                              |
