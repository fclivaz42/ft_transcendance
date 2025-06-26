
import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../../../libs/interfaces/User.ts";
import { httpReply } from "../../../libs/helpers/httpResponse.ts";

export default class UsersValidation {
	static enforceUserValidation(reply: FastifyReply, request: FastifyRequest, users: Partial<User>) {
		if (users.EmailAddress && !UsersValidation.validateUserEmail(users.EmailAddress))
			return httpReply({
				detail: "Invalid email address format.",
				status: 400,
				module: "usermanager",
			}, reply, request);

		if (users.DisplayName && !UsersValidation.validateUserName(users.DisplayName))
			return httpReply({
				detail: "Invalid display name format. It should be 3 to 14 characters long, alphanumeric and underscores only.",
				status: 400,
				module: "usermanager",
			}, reply, request);
		return null;
	}

	static validateUserEmail(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	static validateUserName(name: string): boolean {
		const nameRegex = /^[a-zA-Z0-9_]{3,14}$/; // 3 to 14 characters, alphanumeric and underscores only
		return nameRegex.test(name);
	};
}
