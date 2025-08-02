import axios from 'axios';
import type { AxiosError, AxiosResponse } from "axios";
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import UsersSdk from '../../../libs/helpers/usersSdk.ts';
import DatabaseSDK from '../../../libs/helpers/databaseSdk.ts';
import type { UserLoginProps, UserRegisterProps, User } from '../../../libs/interfaces/User.ts';
import Logger from "../../../libs/helpers/loggers.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";
import fastifyMultipart from '@fastify/multipart';
import { checkParam } from '../helpers/checkParam.ts';

const usersSdk = new UsersSdk();
const db_sdk = new DatabaseSDK();

// usersEnforceAuthorize will throw and send http error if the user is not authorized,

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

	// Checks if the user jwt is valid and returns the user data.
	fastify.all('/authorize', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for authorization.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);

		return reply.code(authorization.status).send(authorization.data);
	});

	// Displays the currently logged user data.
	fastify.all('/me', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user data.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);

		const currentUser = await usersSdk.getUser(authorization.data.sub);

		await usersSdk.postUserAlive(authorization.data.sub).catch(err => { Logger.error(`Failed to update user alive status: ${err.message}`); });

		return reply.code(currentUser.status).send(usersSdk.filterUserData(currentUser.data));
	});

	fastify.all('/me/picture', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user picture.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);

		const userPicture = await usersSdk.getUserPicture(authorization.data.sub);
		if (userPicture.status !== 200)
			throw new Error(`Failed to fetch user picture: ${userPicture.statusText}`);
		if (!userPicture.data)
			return reply.code(404).send("User picture not found");
		return reply.headers(userPicture.headers as any).send(userPicture.data);
	});

	fastify.all('/me/matches', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user matches.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const token = usersSdk.unshowerCookie(request.headers.cookie)["token"];
		const userMatches = await usersSdk.getUserMatches(authorization.data.sub)
			.then(response => response)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: err.response?.data?.detail || 'Failed to fetch user matches',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(userMatches.status).send(userMatches.data);
	});

	fastify.all('/me/alive', async (request, reply) => {
		if (request.method !== 'POST' && request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for user alive status.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const userId = authorization.data.sub;

		if (request.method === 'GET') {
			const userAliveStatus = await usersSdk.getUserAlive(userId)
				.catch(err => {
					if (!axios.isAxiosError(err))
						throw err;
					return reply.code(err.response?.status || 500).send(
						err.response?.data || {
							detail: err.response?.data?.detail || 'Failed to fetch user alive status',
							status: err.response?.status || 500,
							module: 'usermanager'
						});
				});
			return reply.code(userAliveStatus.status).send(userAliveStatus.data);
		}

		const userAliveStatus = await usersSdk.postUserAlive(userId)
			.catch(err => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: err.response?.data?.detail || 'Failed to update user alive status',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(userAliveStatus.status).send(userAliveStatus.data);
	});

	fastify.all('/me/friends', async (request, reply) => {
		if (request.method !== 'GET' && request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user friends.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);

		if (request.method === 'POST') {
			const body = request.body as { PlayerID: string };
			checkParam(body.PlayerID, 'string', 'PlayerID', request, reply);
			const addFriend = await usersSdk.postUserFriend(authorization.data.sub, body.PlayerID).catch(err => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: err.response?.data?.detail || 'Failed to add friend',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
			return reply.code(addFriend.status).send(addFriend.data);
		}

		const userFriends = await usersSdk.getUserFriends(authorization.data.sub)
			.catch(err => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: err.response?.data?.detail || 'Failed to fetch user friends',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(userFriends.status).send(userFriends.data);
	});

	fastify.all('/me/friends/:uuid', async (request, reply) => {
		if (request.method !== 'DELETE')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only DELETE method is allowed for user friend removal.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const removeFriend = await usersSdk.deleteUserFriend(authorization.data.sub, params.uuid)
			.catch(err => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: err.response?.data?.detail || 'Failed to remove friend',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(removeFriend.status).send(removeFriend.data);
	});

	// Returns a JWT token that can be used to authenticate further requests.
	fastify.all('/login', async (request, reply) => {
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for login.' });
		const body = request.body as UserLoginProps;
		checkParam(body.Password, 'string', 'Password', request, reply);
		checkParam(body.ClientId, 'string', 'ClientId', request, reply);
		if (body.DisplayName)
			checkParam(body.DisplayName, 'string', 'DisplayName', request, reply);
		else if (body.EmailAddress)
			checkParam(body.EmailAddress, 'string', 'EmailAddress', request, reply);
		else  {
			return httpReply({
				module: 'usermanager',
				detail: 'Either DisplayName or EmailAddress must be provided for login.',
				status: 400,
			}, reply, request);
		}
		const login = await usersSdk.postLogin(body);
		return reply.code(login.status).send(login.data);
	});

	// The route that CREATES a user.
	fastify.all('/register', async (request, reply) => {
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for registration.' });
		const body = request.body as UserRegisterProps;
		checkParam(body.Password, 'string', 'Password', request, reply);
		checkParam(body.ClientId, 'string', 'ClientId', request, reply);
		checkParam(body.DisplayName, 'string', 'DisplayName', request, reply);
		checkParam(body.EmailAddress, 'string', 'EmailAddress', request, reply);
		const register = await usersSdk.postRegister(body).catch((err: any) => {
			if (axios.isAxiosError(err)) {
				Logger.error(`User registration failed: ${err.message}`);
				return httpReply({
					module: 'usermanager',
					detail: err.response?.data?.detail || 'User registration failed',
					status: err.response?.status || 500,
				}, reply, request);
			}
			throw err;
		});
		UsersSdk.showerCookie(reply, register.data.token, register.data.exp);
		return reply.code(register.status).send(register.data);
	});

	// The route that DELETES current user.
	fastify.all('/delete', async (request, reply) => {
		if (request.method !== 'DELETE')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only DELETE method is allowed for user deletion.' });
		const { password } = request.body as { password?: string };
		checkParam(password, 'string', 'password', request, reply);

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		try {
			await db_sdk.log_user(authorization.data.sub, "PlayerID", password as string)
		} catch (exception) {
			if (exception.status === 403)
				return reply.code(403).send({ error: "Unauthorized", message: "No password is set due to Oauth2." })
			return reply.code(401).send({ error: "Unauthorized", message: "Wrong password." })
		}
		const deleteUser = await usersSdk.deleteUser(authorization.data.sub);
		return reply.code(deleteUser.status).send(deleteUser.data);
	});

	// The route that allows a user to update their data (eg. password, address, etc).
	fastify.all('/update', async (request, reply) => {
		if (!(request.method === 'PUT' || request.method === 'PATCH'))
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only PUT or PATCH method is allowed for user update.' });
		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const userId = authorization.data.sub;
		const formdata = new FormData();
		for await (const part of request.parts()) {
			if (part.type === "file") {
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
				continue;
			}
			formdata.append(part.fieldname, part.value as string)
		}
		if (![...formdata.entries()].length) {
			return httpReply({
				module: 'usermanager',
				detail: 'No user data provided for update.',
				status: 400,
			}, reply, request);
		}
		let resp: AxiosResponse<User> | undefined;
		try {
			resp = await usersSdk.updateUser(userId, formdata);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				Logger.error(`User update failed: ${err.response?.data || err.response?.data?.detail || err.message}`);
				return httpReply({
					module: 'usermanager',
					detail: err.response?.data || 'User update failed',
					status: err.response?.status || 500,
				}, reply, request);
			}
			throw err;
		}
		reply.code(resp.status).send(usersSdk.filterUserData(resp.data));
	});

	fastify.all('/2fa', async (request, reply) => {
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for 2FA.' });
		const body = request.body as { ClientId: string, Code: string };
		checkParam(body.ClientId, 'string', 'ClientId', request, reply);
		checkParam(body.Code, 'string', 'Code', request, reply);
		const resp = await usersSdk.post2FA(body);
		if (resp.status !== 200)
			return reply.code(resp.status).send(resp.data);
		UsersSdk.showerCookie(reply, resp.data.token, resp.data.exp);
		return reply.code(resp.status).send(resp.data);
	});

	// Get public user data by UUID
	fastify.all('/:uuid', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user data retrieval.' });
		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const userData = await usersSdk.getUser(params.uuid);
		if (userData.status !== 200)
			return reply.code(userData.status).send(userData.data);
		return reply.code(userData.status).send(usersSdk.filterPublicUserData(userData.data));
	});

	fastify.all('/:uuid/alive', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST or GET method is allowed for user alive status.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const userId = authorization.data.sub;

		const targetUser = request.params as { uuid: string };
		checkParam(targetUser.uuid, 'string', 'uuid', request, reply);
		const userFriends = await usersSdk.getUserFriends(userId);
		if (targetUser.uuid === userId || userFriends.data.some(friend => friend.PlayerID === targetUser.uuid)) {
			const userAliveStatus = await usersSdk.getUserAlive(targetUser.uuid)
				.catch(err => {
					if (!axios.isAxiosError(err))
						throw err;
					return reply.code(err.response?.status || 500).send(
						err.response?.data || {
							detail: err.response?.data?.detail || 'Failed to fetch user alive status',
							status: err.response?.status || 500,
							module: 'usermanager'
						});
				});
			return reply.code(userAliveStatus.status).send(userAliveStatus.data);
		}

		return httpReply({
			detail: 'You are not allowed to access this user\'s alive status.',
			status: 403,
			module: 'usermanager',
		}, reply, request);
	});

	fastify.all('/:uuid/picture', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user picture.' });
		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const userPicture = await usersSdk.getUserPicture(params.uuid);
		if (userPicture.status !== 200)
			return reply.code(userPicture.status).send(userPicture.data);
		return reply.headers(userPicture.headers as any).send(userPicture.data);
	});

	fastify.all('/logout', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for logout.' });
		return reply
			.header("Set-Cookie", `token=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`)
			.header("location", "/")
			.code(303).send({ message: 'Logged out successfully' });
	});

	fastify.all('/:uuid/matches', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user matches.' });
		await usersSdk.usersEnforceAuthorize(reply, request);
		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const userMatches = await usersSdk.getUserMatches(params.uuid)
			.then(response => response)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: 'Failed to fetch user matches',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		return reply.code(userMatches.status).send(userMatches.data);
	});

	fastify.all('/:uuid/stats', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user stats.' });
		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);
		const params = request.params as { uuid: string };
		checkParam(params.uuid, 'string', 'uuid', request, reply);
		const userStats = await usersSdk.getUserStats(params.uuid)
			.then(response => response)
			.catch((err: any) => {
				if (!axios.isAxiosError(err))
					throw err;
				return reply.code(err.response?.status || 500).send(
					err.response?.data || {
						detail: 'Failed to fetch user stats',
						status: err.response?.status || 500,
						module: 'usermanager'
					});
			});
		if (userStats.data.isPrivate && params.uuid !== authorization.data.sub) {
			return httpReply({
				detail: "User is private",
				status: 403,
				module: "usermanager",
			}, reply, request);
		}
		return reply.code(userStats.status).send(userStats.data);
	});
}
