import axios from "axios";
import type { AxiosResponse } from "axios";
import https from "https";
import type { UserLoginOauthProps, UserLoginProps, UserRegisterProps, Users } from "../interfaces/Users.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "./loggers.ts";
import { httpReply } from "./httpResponse.ts";

export interface UsersSdkConfig {
	apiKey: string;
	serverUrl: string;
}

export interface UsersSdkAuthorizeResponse {
	/**
	 * User ID
	 */
	sub: string;
	/**
	 * Additional data about the user, if any.
	 */
	data?: any;
	/**
	 * The issuer of the token, typically the server URL.
	 */
	iss: string;
	/**
	 * Issued at time.
	 */
	iat: number;
	/**
	 * Expiration time.
	 */
	exp: number;
}

export interface UsersSdkToken extends UsersSdkAuthorizeResponse {
	/**
	 * The token string to be used for authentication.
	 */
	token: string;
}

export interface UsersSdkOptions {
	/**
	 * Parameters to pass to the API endpoint.
	 */
	params?: URLSearchParams;
	/**
	 * Headers to pass to the API endpoint.
	 */
	headers?: Record<string, string>;
	/**
	 * Payload to send in the request body.
	 */
	data?: any;
}

export const defaultConfig: UsersSdkConfig = {
	apiKey: process.env.API_KEY || "",
	serverUrl: "https://usermanager:3000",
}

class UsersSdk {
	private _config: UsersSdkConfig;

	constructor(config?: UsersSdkConfig) {
		this._config = config || defaultConfig;
	}

	/**
	 * 
	 * @param method method to use
	 * @param endpoint api endpoint to call
	 * @param params optional parameters to pass to the endpoint
	 * @returns a promise reponse from axios for template type T
	 * @example apiRequest<UsersSdkLoginResponse>("get", "login")
	 */
	private async apiRequest<T>(method: "get" | "post" | "put" | "delete", endpoint: string, options?: UsersSdkOptions): Promise<AxiosResponse<T>> {
		if (options?.data) {
			if (!options.headers)
				options.headers = {};
			options.headers["Content-Type"] = "application/json";
		}
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });
		const url = `${this._config.serverUrl}/users/${endpoint}`/*${options.params ? `?${options.params.toString()}` : ""}`*/;
		return axios({
			httpsAgent,
			method,
			url,
			headers: {
				Authorization: this._config.apiKey,
				...options?.headers,
			},
			data: options?.data,
			params: options?.params,
			validateStatus: (status => (status >= 200 && status < 300) || status === 401 || status === 403),
		});
	}

	/**
	 * Authorizes a user by their token.
	 * @param token JWT token to authorize.
	 * @returns a promise with the authorization response from axios
	 */
	public async getAuthorize(token: string): Promise<AxiosResponse<UsersSdkAuthorizeResponse>> {
		return this.apiRequest<UsersSdkAuthorizeResponse>("get", "authorize", {
			headers: {
				"X-JWT-Token": token
			}
		});
	}

	/**
	 * Get current user information.
	 * @param uuid User uuid to retrieve information for.
	 * @returns a promise with the user information response from axios
	 */
	public async getUser(uuid: string): Promise<AxiosResponse<Users>> {
		return this.apiRequest<Users>("get", uuid);
	}

	/**
	 * Logs in a user with their username and password.
	 * @param credentials User credentials containing username and password.
	 * @returns a promise with the login response from axios
	 */
	public async postLogin(credentials: UserLoginProps): Promise<AxiosResponse<UsersSdkToken>> {
		return this.apiRequest<UsersSdkToken>("post", "login", {
			data: credentials,
		});
	}

	/**
	 * Logs in a user with their OAuth ID.
	 * @param oauthId User OAuth ID to log in with.
	 * @returns a promise with the login response from axios
	 */
	public async postOauthLogin(credentials: UserLoginOauthProps): Promise<AxiosResponse<UsersSdkToken>> {
		return this.apiRequest<UsersSdkToken>("post", "oauthLogin", {
			data: credentials,
		});
	}

	/**
	 * Register a new user.
	 * @param registerProps User register informations.
	 * @returns a promise with the login response from axios
	 */
	public async postRegister(registerProps: UserRegisterProps): Promise<AxiosResponse<UsersSdkToken>> {
		return this.apiRequest<UsersSdkToken>("post", "register", {
			data: registerProps,
		});
	}

	/**
	 * Deletes a user.
	 */
	public async deleteUser(uuid: string): Promise<AxiosResponse> {
		return this.apiRequest<void>("delete", uuid, {
			headers: {
				"X-JWT-Token": this._config.apiKey,
			},
		});
	}

	/**
	 * Filters user data to remove sensitive information such as passwords, OAuth IDs, and session tokens.
	 * @param user User object to filter.
	 * @returns Filtered user object without sensitive information.
	 */
	static filterUserData(user: Users) {
		const { Password, OAuthID, ...filteredUser } = user;
		return filteredUser;
	}

	/**
	 * Filters user data to remove sensitive information such as passwords, OAuth IDs, and session tokens.
	 * @param user User object to filter.
	 * @returns Filtered user object without sensitive information.
	*/
	filterUserData(user: Users) {
		return UsersSdk.filterUserData(user);
	}

	/**
	 * Filters user data to remove sensitive information and returns a public version of the user object.
	 * @param user User object to filter.
	 * @returns Public user object without sensitive information.
	 */
	public static filterPublicUserData(user: Users) {
		const filteredUser = this.filterUserData(user);

		const { Bappy, EmailAddress, FamilyName, FirstName, FriendsList, PhoneNumber, ...publicUser } = filteredUser;
		return publicUser;
	}

	/**
	 * Filters user data to remove sensitive information and returns a public version of the user object.
	 * @param user User object to filter.
	 * @returns Public user object without sensitive information.
	 */
	filterPublicUserData(user: Users) {
		return UsersSdk.filterPublicUserData(user);
	}

	/**
 * Asks the UsersSdk to enforce user authorization based on the provided JWT token.
 * This function will throw an error if the authorization fails or if no token is provided.
 * It will also send Unauthorized responses.
 * @throws Error if the authorization fails or if no token is provided. Will also send Unauthorized responses.
 * @param rep fastify reply object
 * @param req fastify request object
 * @returns
 */
	async usersEnforceAuthorize(rep: FastifyReply | any, req: FastifyRequest | any) {
		const reqRef = req as FastifyRequest;
		const cookies = UsersSdk.unshowerCookie(reqRef.headers.cookie);
		if (!cookies || !cookies["token"]) {
			const detail = "No `token` cookie found in request headers.";
			httpReply({
				module: "core",
				detail: detail,
				status: 401,
			}, rep, req);
			throw new Error(detail);
		}
		const jwtToken = await this.getAuthorize(cookies["token"]);
		if (jwtToken.status !== 200) {
			const detail = `Authorization failed with status ${jwtToken.status}: ${jwtToken.statusText}`;
			httpReply({
				module: "core",
				detail: detail,
				status: jwtToken.status,
			}, rep, req);
			throw new Error(detail);
		}
		return jwtToken;
	}

	/**
	 * 
	 * @param rep fastify reply object
	 * @param token JWT token to set in the cookie.
	 * @param exp optional expiration time in seconds for the cookie, defaults to 3600 seconds (1 hour).
	 */
	public static showerCookie(rep: FastifyReply | any, token: string, exp?: number) {
		rep.header("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${exp || 3600}`);
	}

	/**
	 * 
	 * @param rep fastify reply object
	 * @param token JWT token to set in the cookie.
	 * @param exp optional expiration time in seconds for the cookie, defaults to 3600 seconds (1 hour).
	 */
	public showerCookie(rep: FastifyReply | any, token: string, exp?: number) {
		UsersSdk.showerCookie(rep, token, exp);
	}

	/**
	 * Converts a cookie header string into an object.
	 * @param cookieHeader The cookie header string to convert.
	 * @returns An object representing the cookies.
	 */
	public static unshowerCookie(cookieHeader: string | undefined) {
		const cookies: Record<string, string> = {};
		if (!cookieHeader) return cookies;

		cookieHeader.split(';').forEach(cookie => {
			const [key, value] = cookie.trim().split('=')
			cookies[key] = value
		})
		return cookies
	}

	/**
	 * Converts a cookie header string into an object.
	 * @param cookieHeader The cookie header string to convert.
	 * @returns An object representing the cookies.
	 */
	public unshowerCookie(cookieHeader: string) {
		return UsersSdk.unshowerCookie(cookieHeader);
	}

	/**
	 *
	 * Enforces user authorization by checking the JWT token in the request cookies.
	 * This function will throw an error if the authorization fails or if no token is provided.
	 * @throws {status: 401, statusText: "Unauthorized", message: string} if the authorization fails or if no token is provided.
	 * @param req fastify request object
	 * @returns A promise that resolves to the user authorization response.
	 */
	public async enforceAuthorize(req: FastifyRequest | any): Promise<UsersSdkAuthorizeResponse> {
		let output: UsersSdkAuthorizeResponse | undefined;
		const cookies = UsersSdk.unshowerCookie(req.headers.cookie);
		if (!cookies || !cookies["token"]) {
			const detail = "No `token` cookie found in request headers.";
			throw {
				status: 401,
				statusText: "Unauthorized",
				message: detail
			}
		}
		const token = (await this.getAuthorize(cookies["token"])
			.then(jwtToken => {
				if (jwtToken.status < 200 || jwtToken.status >= 300) {
					const message = `Authorization failed with status ${jwtToken.status}: ${jwtToken.statusText}`;
					throw {
						status: jwtToken.status,
						statusText: jwtToken.statusText,
						message
					}
				}
				output = jwtToken.data;
			})
			.catch(err => {
				const message = `Authorization failed: ${err.message}`;
				throw {
					status: err.status || 500,
					statusText: err.statusText || "Internal Server Error",
					message
				}
			}));
		if (!output) {
			const detail = "Authorization failed: No user data returned.";
			throw {
				status: 401,
				statusText: "Unauthorized",
				message: detail
			}
		}
		return output;
	}

	public async updateUser(userId: string, data: Partial<Users>): Promise<AxiosResponse<Users>> {
		return this.apiRequest<Users>("put", userId, {
			data,
		});
	}
}

export default UsersSdk;
