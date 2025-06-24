import type { FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import type { OauthToken, OauthCallbackRequest } from "../interfaces/OauthInterfaces.ts";
import { config } from "../managers/ConfigManager.ts";
import { stateManager } from "../managers/StateManager.ts";
import { GoogleJwtManager } from "../managers/GoogleJwtManager.ts";
import { Logger } from "../../../libs/helpers/loggers.ts";
import type { Users, UserRegisterOauthProps } from "../../../libs/interfaces/Users.ts";
import https from "https";
import UsersSdk from "../../../libs/helpers/usersSdk.ts";
import crypto from "crypto";

function validateParams(query: OauthCallbackRequest) {
	if (!query.code) {
		return {
			detail: "Missing code query from request",
			status: 400,
			module: "oauth2",
		};
	}
	if (!query.state) {
		return {
			detail: "Missing state query from request",
			status: 400,
			module: "oauth2",
		};
	}
	if (!stateManager.getStateValue(query.state)) {
		return {
			detail: "State id was not found",
			status: 404,
			module: "oauth2",
		};
	}
	return null;
}


export async function getCallback(req: FastifyRequest, rep: FastifyReply) {
	const prohibited = checkRequestAuthorization(req, rep);
	if (prohibited)
		return prohibited;

	const query = req.query as OauthCallbackRequest;

	const validationError = validateParams(query);
	if (validationError)
		return httpReply(validationError, rep, req);

	// fetch access token from google
	const token = await fetchOauthAccessToken(query);
	if (!token) {
		return httpReply({
			detail: "Could not fetch access_token",
			status: 500,
			module: "oauth2",
		}, rep, req);
	}
	token.jwt_decode = (new GoogleJwtManager(token.id_token)).jwtDecoded;

	// update session state
	stateManager.initSession(query.state, token);
	// create or update the user in the database
	await updateUser(token, await getMatchingOauthUser(token));
	// log the user in using the OAuth ID
	const userSdk = new UsersSdk();
	const login = (await userSdk.postOauthLogin({ OAuthID: token.jwt_decode.subject })).data;
	return rep.status(200).send({ ...login });
}

async function getMatchingOauthUser(token: OauthToken) {
	if (!token.jwt_decode)
		throw new Error("Token does not contain jwt_decode");
	try {
		return (await axios.get<Users>(`http://db:3000/Players/oauth/${token.jwt_decode.subject}`, {
			headers: {
				"Authorization": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		})).data;
	} catch (error) {
		Logger.debug(error);
		Logger.debug("No user found with OAuth ID, checking by email.");
		try {
			const matchingUser = (await axios.get<Users>(`http://db:3000/Players/email/${token.jwt_decode.email}`, {
				headers: {
					"Authorization": process.env.API_KEY || "",
					"Content-Type": "application/json",
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			})).data;

			if (matchingUser.OAuthID)
				throw new Error("User already exists with OAuth ID");
			return matchingUser;
		} catch (error) {
			Logger.debug(error);
			Logger.debug("No user found with email or OAuth ID.");
			return undefined;
		}
	}
}

async function updateUser(token: OauthToken, matchingUser: Users | undefined) {
	if (!token.jwt_decode)
		throw new Error("Token does not contain jwt_decode");

	const displayName = token.jwt_decode.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").substring(0, 9);
	if (!matchingUser) {
		const maxTry = 10;
		for (let i = 0; i < maxTry; i++) {
			const uniqueSuffix = crypto.randomBytes(4).toString('hex').substring(0, 13 - displayName.length);
			// create a new user with OAuth ID
			const userRegister: UserRegisterOauthProps = {
				DisplayName: `${displayName}.${uniqueSuffix}`,
				EmailAddress: token.jwt_decode.email,
				Password: "",
				OAuthID: token.jwt_decode.subject,
			};
			try {
				await axios.post<Users>("http://db:3000/Players", userRegister, {
					headers: {
						"Authorization": process.env.API_KEY || "",
						"Content-Type": "application/json",
					},
					httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				});
				break; // if user is created successfully
			} catch (error) {
				if (error.response && error.response.status === 409) {
					// Brute force if already exists
					userRegister.DisplayName = `${displayName}${i}`;
					if (i === maxTry - 1)
						throw new Error("Failed to create user after multiple attempts");
					continue;
				} else
					throw new Error("Failed to create user");
			}
		}
	} else if (!matchingUser.OAuthID) {
		// update user by email with OAuth ID
		const updateUser: Partial<Users> = {
			OAuthID: token.jwt_decode.subject,
		}
		await axios.put<Users>(`http://db:3000/Players/id/${matchingUser.PlayerID}`, updateUser, {
			headers: {
				"Authorization": process.env.API_KEY || "",
				"Content-Type": "application/json",
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
	}
	else {
		// simple login the user
		if (!matchingUser.OAuthID)
			throw new Error("User does not have OAuth ID");
	}
}

async function fetchOauthAccessToken(query: OauthCallbackRequest) {
	let tokenTemp: OauthToken | undefined;
	(await axios.post(config.OauthConfig.token_ep, {
		code: query.code,
		client_id: config.OauthConfig.client_id,
		client_secret: config.OauthConfig.secret,
		redirect_uri: config.OauthConfig.callback,
		grant_type: config.OauthConfig.grant_type
	}, { validateStatus: (status) => status >= 200 && status < 300 }).then(resp => {
		tokenTemp = resp.data;
	}).catch(err => {
		Logger.error(err);
	}));

	return tokenTemp;
}
