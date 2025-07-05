import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersLoginEndpoint from "./users/login.ts";
import usersAuthorizeEndpoint from "./users/authorize.ts";
import usersRegisterEndpoint from "./users/register.ts";
import checkRequestAuthorization from "../managers/AuthorizationManager.ts";
import type { User } from "../../../libs/interfaces/User.ts";
import usersOauthLoginEndpoint from "./users/oauthLogin.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import UsersValidation from "../handlers/UsersValidation.ts";
import DatabaseSDK from "../../../libs/helpers/databaseSdk.ts";
import Logger from "../../../libs/helpers/loggers.ts";
import axios from "axios";
import UsersSdk from "../../../libs/helpers/usersSdk.ts";
import type { MultipartFile } from "@fastify/multipart";
import type { Match } from "../../../libs/interfaces/Match.ts";

export default async function initializeRoute(app: FastifyInstance, opts: FastifyPluginOptions) {

	const db_sdk = new DatabaseSDK();

	app.get("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const user = await db_sdk.get_user(params.uuid, "PlayerID");
		try {
			await db_sdk.get_user_picture(params.uuid);
			user.data.Avatar = `/api/users/${params.uuid}/picture`;
		} catch (error) {
			Logger.debug(`No picture found for user ${params.uuid}:\n${error}`);
		}
		return reply.code(user.status).send(user.data);
	});

	app.post("/:uuid/alive", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const user: Partial<User> = request.body as Partial<User>;
		user.LastAlive = Date.now();
		const res = await db_sdk.update_user(user);
		reply.code(200).send({LastAlive: res.data.LastAlive});
	});

	app.get("/:uuid/alive", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const user = await db_sdk.get_user(params.uuid, "PlayerID");
		const isAlive = user.data.LastAlive && (Date.now() - user.data.LastAlive < 30000);
		return reply.code(200).send({
			isAlive,
		})
	});

	app.get("/:uuid/picture", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const resp = await db_sdk.get_user_picture(params.uuid)
			.catch((error) => {
				if (axios.isAxiosError(error) && error.response) {
					Logger.debug(`Error getting user picture for ${params.uuid}`);
					return httpReply({module: "usermanager", detail: error.response.statusText, status: error.response.status}, reply, request);
				}
				throw error;
			});
		if (resp.status > 300)
			return reply.code(resp.status).send(resp.statusText);
		if (!resp.data)
			return reply.code(404).send("User picture not found");
		return reply.headers(resp.headers as any).send(resp.data);
	});

	app.get("/:uuid/friends", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const friends = await db_sdk.get_user_friends(params.uuid)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: "Failed to fetch user friends",
						status: err.response?.status || 500,
						module: "usermanager"
					});
			});

		// Filter out any undefined or null friends
		let filteredFriends: any = friends.data.filter((friend: Partial<User>) => friend);

		// Filter users to remove any personal data
		filteredFriends =  filteredFriends.map((friend: User) => UsersSdk.filterPublicUserData(friend as User));

		// Filter out any friends that are not in the database and delete them
		filteredFriends = await filteredFriends.filter(async (friend: Partial<User>) => {
			try {
				await db_sdk.get_user(friend.PlayerID as string, "PlayerID");
				return true;
			} catch (error) {
				const userSdk = new UsersSdk();
				// TODO: Remove friend from user's friends list
			}
		});

		// Add avatar URL to each friend if available
		filteredFriends = await Promise.all(filteredFriends.map(async (friend: Partial<User>) => {
			try {
				await db_sdk.get_user_picture(friend.PlayerID as string);
				friend.Avatar = `/api/users/${friend.PlayerID}/picture`;
			} catch (error) {
				Logger.debug(`No picture found for friend ${friend.PlayerID}:\n${error}`);
			}
			return friend;
		}));

		// Sort friends by DisplayName
		filteredFriends.sort((a: Partial<User>, b: Partial<User>) => {
			if (!a.DisplayName || !b.DisplayName) return 0;
			return a.DisplayName.localeCompare(b.DisplayName);
		});
	
		// Return the filtered friends list
		return reply.code(friends.status).send(filteredFriends);
	});

	app.post("/:uuid/friends", async (request, reply) => {
		// TODO: Implement friend request logic better once dbSdk supports it
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const body = request.body as { PlayerID: string };
		if (!body.PlayerID)
			return httpReply({
				detail: "PlayerID is required",
				status: 400,
				module: "usermanager",
			}, reply, request);
		const user = (await db_sdk.get_user(params.uuid, "PlayerID")).data;
		if (user.FriendsList?.includes(body.PlayerID)) {
			return httpReply({
				detail: "User is already a friend",
				status: 409,
				module: "usermanager",
			}, reply, request);
		}
		user.FriendsList = user.FriendsList || [];
		user.FriendsList.push(body.PlayerID);
		const postFriends = await db_sdk.update_user(user)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: "Failed to add friend",
						status: err.response?.status || 500,
						module: "usermanager"
					});
			});
		return reply.code(postFriends.status).send(postFriends.data);
	});

	app.delete("/:uuid/friends/:friendId", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string, friendId: string };
		const user = (await db_sdk.get_user(params.uuid, "PlayerID")).data;
		if (!user.FriendsList || !user.FriendsList.includes(params.friendId)) {
			return httpReply({
				detail: "User is not a friend",
				status: 404,
				module: "usermanager",
			}, reply, request);
		}
		user.FriendsList = user.FriendsList.filter((friendId: string) => friendId !== params.friendId);
		const deleteFriends = await db_sdk.update_user(user)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: "Failed to remove friend",
						status: err.response?.status || 500,
						module: "usermanager"
					});
			});
		return reply.code(deleteFriends.status).send(deleteFriends.data);
	});

	app.get("/:uuid/stats", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const matches = await db_sdk.get_player_matchlist(params.uuid);
		const wonMatches = matches.data.filter((match: Match) => match.WPlayerID === params.uuid);
		return reply.code(200).send({
			"wonMatches": wonMatches.length,
			"lostMatches": matches.data.length - wonMatches.length,
			"totalMatches": matches.data.length,
		});
	});

	app.delete("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const resp = await db_sdk.delete_user(params.uuid)
		return reply.code(resp.status).send(resp.data);
	});

	app.put("/:uuid", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		let user: Partial<User> = {}
		const params = request.params as { uuid: string };
		const formdata = new FormData();
		for await (const part of request.parts()) {
			if (part.type === "field")
				user[part.fieldname] = part.value
			else {
				if (formdata.keys.length !== 0)
					continue;
				if (part.mimetype.includes("image/")) {
					const chunks: Uint8Array[] = [];
					const file = part.file;
					for await (const chunk of file)
						chunks.push(chunk);
					const buffer = Buffer.concat(chunks);
					formdata.append("file", new File([buffer], part.filename, { type: part.mimetype }));
				}
			}
		}
		const userValidation = UsersValidation.enforceUserValidation(reply, request, user);
		if (userValidation)
			return userValidation;
		
		if (formdata.has("file"))
			await db_sdk.set_user_picture(params.uuid, formdata);
		if (Object.keys(user).length >= 1) {
			user.PlayerID = params.uuid;
			await db_sdk.update_user(user as User)
		}
		return reply.code(200).send(UsersSdk.filterUserData(user as User));
	});

	app.post("/", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		// body validation
		const body = request.body as Partial<User>;
		if (!body.DisplayName)
			return reply.code(400).send({ error: "DisplayName is required" });
		if (!body.EmailAddress)
			return reply.code(400).send({ error: "EmailAddress is required" });
		if (body.PlayerID)
			return reply.code(400).send({ error: "PlayerID is not allowed to be set manually" });

		const db = await db_sdk.create_user(body as User)
		return reply.code(db.status).send(db.data);
	});

	app.get("/:uuid/matches", async (request, reply) => {
		Logger.info("Received request for matches");
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;
		const params = request.params as { uuid: string };
		const matches = await db_sdk.get_player_matchlist(params.uuid);
		return reply.code(matches.status).send(matches.data);
	});

	usersAuthorizeEndpoint(app, opts);
	usersLoginEndpoint(app, opts);
	usersRegisterEndpoint(app, opts);
	usersOauthLoginEndpoint(app, opts);
}
