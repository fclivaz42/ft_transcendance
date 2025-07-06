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
import nodemailer from "nodemailer";
import { codeUser } from './2FAreceipt.ts';

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
			await send2faVerification(loggedUser.EmailAddress);
			console.log(codeUser.get(loggedUser.EmailAddress));
		}
		catch (err) {
			return reply.status(503).send(`Error during 2FA :", ${err}`);
		}
		return reply.status(200).send("2fa send");
	});
}

const send2faVerification = async (email: string): Promise<void> => {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.TWOFA_SERVICE,
			port: process.env.TWOFA_PORT,
			secure: false,
			auth: {
				user: process.env.AUTH_EMAIL,
				pass: process.env.AUTH_EMAIL_PASSW,
			}
		});

		const code: string = randomNumericString(6);
		const mailOptions = {
			from: `"Sarif " <${process.env.AUTH_EMAIL}>`,
			to: email,
			subject: 'Your code 2FA',
			text: `Your verification code is : ${code}`,
		};
		await transporter.sendMail(mailOptions);
		console.log(`2FA email sent to ${email}`);
		codeUser.set(email, code);
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
