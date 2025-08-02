import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { jwt } from '../../managers/JwtManager.ts';
import { randomBytes, randomInt } from 'crypto';
import checkRequestAuthorization from '../../managers/AuthorizationManager.ts';
import type { UserLoginProps, User } from '../../../../libs/interfaces/User.ts';
import databaseSdk from "../../../../libs/helpers/databaseSdk.ts"
import { httpReply } from "../../../../libs/helpers/httpResponse.ts";
import axios from 'axios';
import https from 'https';
import Logger from '../../../../libs/helpers/loggers.ts';
import DatabaseSDK from '../../../../libs/helpers/databaseSdk.ts';
import { codeUser } from './2FAreceipt.ts';
import type { TwoFaLogUser } from './2FAreceipt.ts';
import { config } from '../../managers/ConfigManager.ts';
import EmailManager from '../../managers/EmailManager.ts';
import { template } from './2FAreceipt.ts';
import path from 'path';

export default async function usersLoginEndpoint(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.post("/login", async (request, reply) => {
		const authorization = checkRequestAuthorization(request, reply);
		if (authorization)
			return authorization;

		const userLogin = request.body as UserLoginProps;
		const db_sdk = new DatabaseSDK();

		let loggedUser: User | undefined;
		if (userLogin.DisplayName) {
			loggedUser = await db_sdk.log_user(userLogin.DisplayName, "DisplayName", userLogin.Password)
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by DisplayName: " + error);
					return undefined;
				});
		}
		else if (userLogin.EmailAddress) {
			loggedUser = await db_sdk.log_user(userLogin.EmailAddress, "EmailAddress", userLogin.Password)
				.then(response => response.data)
				.catch(error => {
					Logger.error("Error fetching user by EmailAddress:" + error);
					return undefined;
				});
		}
		else
			return httpReply({
				module: "usermanager",
				detail: "Invalid login request, username or email is required.",
				status: 400
			}, reply, request);

		if (!loggedUser) {
			return httpReply({
				module: "usermanager",
				detail: "Login credentials are incorrect.",
				status: 401
			}, reply, request);
		}
		if (!loggedUser.PlayerID)
			throw new Error("Missing PlayerID in user data");

		try {
			await send2faVerification(loggedUser.EmailAddress, userLogin.ClientId, loggedUser.PlayerID);
		}
		catch (err) {
			return reply.status(503).send(`Error during 2FA :", ${err}`);
		}
		return httpReply({
			detail: "2fa sent",
			status: 200,
			module: "usermanager",
		}, reply, request);
	});
}

function loadTemplate(code: string): string {
	return template.replace('{{CODE_2FA}}', code);
}

const send2faVerification = async (email: string, id: string, user: string): Promise<void> => {
	try {
		let code: string;
		while (true) {
			code = randomNumericString(6);
			if (!codeUser[code])
				break;
		}
		const mailOptions = {
			from: config.SmtpConfig.from,
			to: email,
			subject: 'Your code 2FA',
			html: loadTemplate(code),
			attachments: [
				{
					filename: 'Sarif_Industries_Logo.svg.png',
					path: path.join(import.meta.dirname, 'images', 'SarifLogo.svg.png'),
					cid: 'logoSarif'
				}
			]
		};
		EmailManager.sendMail(mailOptions).catch((err) => {
			Logger.error(`Error sending 2FA email to ${email}: ${err}`);
		});
		codeUser.set(id, { Code: code, PlayerID: user, nbrOfTry: 0 } as TwoFaLogUser);
		new Promise((resolve) => {
			setTimeout(() => {
				codeUser.delete(id);
				resolve(true);
			}, 300000);
		});
	}
	catch (err) {
		console.error("Error during 2FA :", err);
		throw err;
	}
}

function randomNumericString(length: number) {
	let result = '';
	const digits = '0123456789';
	const randomData = randomBytes(length);
	for (let i = 0; i < length; i++) {
		result += digits[randomData[i] % digits.length];
	}
	return result;
}
