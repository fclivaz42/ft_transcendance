import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import UsersSdk from '../modules/users/usersSdk.ts'
import type { UsersSdkLoginProps, UsersSdkRegisterProps } from '../modules/users/usersSdk.ts'
import { usersEnforceAuthorize } from '../modules/users/usersAuthorization.ts';
import UsersFilter from '../modules/users/usersFilter.ts';

const usersSdk = new UsersSdk();

// usersEnforceAuthorize will throw and send http error if the user is not authorized,

export default async function module_routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

	// Checks if the user jwt is valid and returns the user data.
	fastify.all('/authorize', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/authorize called");
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for authorization.' });

		const authorization = await usersEnforceAuthorize(reply, request, usersSdk);
	
		return reply.code(authorization.status).send(authorization.data);
	});

	// Displays the currently logged user data.
	fastify.all('/me', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/me called");
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user data.' });

		const authorization = await usersEnforceAuthorize(reply, request, usersSdk);

		const currentUser = await usersSdk.getUser(authorization.data.sub);
		return reply.code(currentUser.status).send(UsersFilter.filterUserData(currentUser.data));
	});

	// Returns a JWT token that can be used to authenticate further requests.
	fastify.all('/login', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/login called");
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for login.' });
		const login = await usersSdk.postLogin(request.body as UsersSdkLoginProps);
		return reply.code(login.status).send(login.data);
	});

	// The route that CREATES a user.
	fastify.all('/register', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/register called");
		if (request.method !== 'POST')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only POST method is allowed for registration.' });

		const register = await usersSdk.postRegister(request.body as UsersSdkRegisterProps);
		return reply.code(register.status).send(register.data);
	});

	// The route that DELETES current user.
	fastify.all('/delete', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/delete called");
		if (request.method !== 'DELETE')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only DELETE method is allowed for user deletion.' });

		const authorization = await usersEnforceAuthorize(reply, request, usersSdk);

		const deleteUser = await usersSdk.deleteUser(authorization.data.sub);
		return reply.code(deleteUser.status).send(deleteUser.data);
	});

	// The route that allows a user to update their data (eg. password, address, etc).
	fastify.all('/update', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/update called");
		if (!(request.method === 'PUT' || request.method === 'PATCH'))
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only PUT or PATCH method is allowed for user update.' });
	});

	// Get public user data by UUID
	fastify.all('/:uuid', async (request, reply) => {
		if (process.env.RUNMODE?.toLowerCase() === "debug")
			console.debug("ALL /users/:uuid called");
		if (request.method !== 'GET')
			return reply.code(405).send({ error: 'Method Not Allowed', message: 'Only GET method is allowed for user data retrieval.' });
		const params = request.params as { uuid: string };
		const userData = await usersSdk.getUser(params.uuid);
		if (userData.status !== 200)
			return reply.code(userData.status).send(userData.data);
		return reply.code(userData.status).send(UsersFilter.filterPublicUserData(userData.data));
	});
}
