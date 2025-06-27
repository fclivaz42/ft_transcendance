import axios from 'axios';
import type { AxiosResponse } from "axios";
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import UsersSdk from '../../../libs/helpers/usersSdk.ts';
import type { UserLoginProps, UserRegisterProps, User } from '../../../libs/interfaces/User.ts';
import Logger from "../../../libs/helpers/loggers.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";

const usersSdk = new UsersSdk();

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

	// Returns a JWT token that can be used to authenticate further requests.
	fastify.all('/login', async (request, reply) => {
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for login.' });
		const login = await usersSdk.postLogin(request.body as UserLoginProps);
		UsersSdk.showerCookie(reply, login.data.token, login.data.exp);
		return reply.code(login.status).send(login.data);
	});

	// The route that CREATES a user.
	fastify.all('/register', async (request, reply) => {
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for registration.' });
		const register = await usersSdk.postRegister(request.body as UserRegisterProps).catch((err: any) => {
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
	/*fastify.all('/delete', async (request, reply) => {
		if (request.method !== 'DELETE')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only DELETE method is allowed for user deletion.' });

		const authorization = await usersSdk.usersEnforceAuthorize(reply, request);

		const deleteUser = await usersSdk.deleteUser(authorization.data.sub);
		return reply.code(deleteUser.status).send(deleteUser.data);
	});*/

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
				Logger.error(`User update failed: ${err.message}`);
				return httpReply({
					module: 'usermanager',
					detail: err.response?.data?.detail || 'User update failed',
					status: err.response?.status || 500,
				}, reply, request);
			}
			throw err;
		}
		reply.code(resp.status).send(usersSdk.filterUserData(resp.data));
	});

	// Get public user data by UUID
	fastify.all('/:uuid', async (request, reply) => {
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user data retrieval.' });
		const params = request.params as { uuid: string };
		const userData = await usersSdk.getUser(params.uuid);
		if (userData.status !== 200)
			return reply.code(userData.status).send(userData.data);
		return reply.code(userData.status).send(usersSdk.filterPublicUserData(userData.data));
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
		const token = usersSdk.unshowerCookie(request.headers.cookie)["token"];
		if (!token)
			return httpReply({detail: "Non authorized request, missing token.", status: 401, module: "usermanager"}, reply, request);
		const params = request.params as { uuid: string };
		const userMatches = await usersSdk.getUserMatches(params.uuid, token)
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
}
