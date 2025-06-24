import axios from "axios";
import type { FastifyInstance, FastifyPluginOptions, FastifyReply } from 'fastify'
import UsersSdk from '../../../libs/helpers/usersSdk.ts';
import type { UserLoginProps, UserRegisterProps, Users } from '../../../libs/interfaces/Users.ts';
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
		if (!request.body)
			return httpReply({
				module: 'usermanager',
				detail: 'No user data provided for update.',
				status: 400,
		}, reply, request);
		const data = request.body as Partial<Users>;
		if (data.PlayerID)
			return httpReply({
				module: 'usermanager',
				detail: 'PlayerID cannot be updated.',
				status: 400,
			}, reply, request);
		const resp = await usersSdk.updateUser(userId, request.body as Partial<Users>);
		if (resp.status >= 400) {
			return httpReply({
				module: 'usermanager',
				detail: `Failed to update user data: ${resp.statusText}`,
				status: resp.status,
			}, reply, request);
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
}
