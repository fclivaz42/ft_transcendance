import axios from "axios";
import https from "https";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type * as fft from "fastify";
import type { User } from "../interfaces/User.ts";
import type { Match, Match_complete } from "../interfaces/Match.ts";
import type { Tournament_lite, Tournament_metadata } from "../interfaces/Tournament.ts";

export type UUIDv4 = string

interface db_sdk_options {
	params?: string;
	headers?: Record<string, string>;
	body?: any
}

// WARN: DELETE/UPDATE USER!

export default class DatabaseSDK {

	private api_key = process.env.API_KEY
	private server_url = "http://database:3000"
	private param_str = "{?PARAMS}"

	constructor() { }

	private async api_request<T>(method: "GET" | "POST" | "PUT" | "DELETE", table: "Players" | "Matches" | "Tournaments" | "CurrentContract", endpoint?: string, options?: db_sdk_options): Promise<AxiosResponse<T>> {
		if (options?.body) {
			if (!options.headers)
				options.headers = {};
			options.headers["Content-Type"] = "application/json";
		}
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });

		let url = `${this.server_url}/${table}`
		if (endpoint)
			url = url + endpoint
		if (endpoint && options?.params)
			url = url.replace(this.param_str, options?.params)
		return await axios({
			httpsAgent,
			method,
			url,
			headers: {
				Authorization: this.api_key,
				...options?.headers,
			},
			data: options?.body,
		})
	}

	private async get_friends_from_user(user: User): Promise<AxiosResponse<Array<User>>> {
		if (!user.FriendsList)
			return {
				data: [],
				status: 200,
				statusText: "OK",
				headers: {},
				config: {} as InternalAxiosRequestConfig
			}
		return await this.api_request<Array<User>>("GET", "Players", "/multiget", {
			headers: {
				Field: "PlayerID",
				Array: JSON.stringify(user.FriendsList)
			}
		})
	}

	private async get_friends_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<User>>> {
		const req_user: User = (await this.get_user(user, "PlayerID")).data
		return await this.get_friends_from_user(req_user)
	}

	public async get_user_friends(user: UUIDv4 | User): Promise<AxiosResponse<Array<User>>> {
		if (typeof user === "string")
			return await this.get_friends_from_uuid(user)
		return await this.get_friends_from_user(user)
	}

	public async get_user_picture(user: User) {

	}

	public async set_user_picture(user: User, picture) {

	}

	public async log_user(query: string, type: "PlayerID" | "DisplayName" | "EmailAddress", plaintext: string): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}/check_passwd`, {
			params: query,
			headers: {
				Password: plaintext
			}
		})
	}

	public async create_user(user: User): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("POST", "Players", undefined, { body: user })
	}

	public async get_user(identifier: string, type: "PlayerID" | "DisplayName" | "EmailAddress" | "OAuthID"): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}`, { params: identifier })
	}

	public async create_tournament(tournament: Tournament_metadata) { }

	public async get_tournament(tournament_id: UUIDv4) {
		return await this.api_request<User>("GET", "Tournaments", `/TournamentID/${this.param_str}`, { params: tournament_id })

	}

	public async get_matchlist(): Promise<AxiosResponse<Array<Match>>> {
		return await this.api_request<Array<Match>>("GET", "Matches", "/multiget")
	}

	private async get_player_matchlist_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<Match>>> {
		return await this.api_request<Array<Match>>("GET", "Matches", `/PlayerID/${this.param_str}`, { params: user })
	}

	private async get_player_matchlist_from_user(user: User): Promise<AxiosResponse<Array<Match>>> {
		if (!user.PlayerID)
			throw "error.empty.playerid"
		return await this.get_player_matchlist_from_uuid(user.PlayerID)
	}

	public async get_player_matchlist(user: UUIDv4 | User): Promise<AxiosResponse<Array<Match>>> {
		if (typeof user === "string")
			return await this.get_player_matchlist_from_uuid(user)
		return await this.get_player_matchlist_from_user(user)
	}

	public async create_match(match: Match_lite) { }

	public async get_match(match_id: UUIDv4) {
		return await this.api_request<User>("GET", "Matches", `/MatchID/${this.param_str}`, { params: match_id })
	}
}
