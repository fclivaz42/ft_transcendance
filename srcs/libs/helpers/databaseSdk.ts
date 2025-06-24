import axios from "axios";
import https from "https";
import type * as at from "axios";
import type * as fft from "fastify";
import type { Users } from "../interfaces/Users";
import type { Match } from "../interfaces/Match";

export type UUIDv4 = string

interface db_sdk_options {
	params?: string;
	headers?: Record<string, string>;
	body?: any
}

export default class databaseSDK {

	private api_key = process.env.API_KEY
	private server_url = "http://localhost:3000"
	private param_str = "{?PARAMS}"

	constructor() { }

	private async api_request<T>(method: "GET" | "POST" | "PUT" | "DELETE", table: "Players" | "Matches" | "Tournaments" | "CurrentContract", endpoint?: string, options?: db_sdk_options): Promise<at.AxiosResponse<T>> {
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
		return axios({
			httpsAgent,
			method,
			url,
			headers: {
				Authorization: this.api_key,
				...options?.headers,
			},
			data: options?.body,
			validateStatus: (status => (status >= 200 && status < 300) || status === 401 || status === 403 || status === 404),
		})
	}

	private async get_friends_from_user(user: Users): Promise<at.AxiosResponse<Array<Users>>> {
		if (!user.FriendsList)
			return {
				data: [],
				status: 200,
				statusText: "OK",
				headers: {},
				config: {} as at.InternalAxiosRequestConfig
			}
		return this.api_request<Array<Users>>("GET", "Players", "/multiget", {
			headers: {
				Field: "PlayerID",
				Array: JSON.stringify(user.FriendsList)
			}
		})
	}

	private async get_friends_from_uuid(user: UUIDv4): Promise<at.AxiosResponse<Array<Users>>> {
		const req_user: Users = (await this.get_user(user, "PlayerID")).data
		return this.get_friends_from_user(req_user)
	}

	public async get_user_friends(user: UUIDv4 | Users): Promise<at.AxiosResponse<Array<Users>>> {
		if (typeof user === "string")
			return this.get_friends_from_uuid(user)
		return this.get_friends_from_user(user)
	}

	public async get_user_picture(user: Users) {

	}

	public async set_user_picture(user: Users, picture) {

	}

	public async log_user<User>(query: string, type: "PlayerID" | "DisplayName" | "EmailAddress", plaintext: string): Promise<at.AxiosResponse<Users>> {
		return this.api_request<Users>("GET", "Players", `/${type}/${this.param_str}/check_passwd`, {
			params: query,
			headers: {
				Password: plaintext
			}
		})
	}

	public async create_user<User>(user: Users): Promise<at.AxiosResponse<Users>> {
		return this.api_request<Users>("POST", "Players", undefined, { body: user })
	}

	public async get_user(identifier: string, type: "PlayerID" | "DisplayName" | "EmailAddress"): Promise<at.AxiosResponse<Users>> {
		return this.api_request<Users>("GET", "Players", `/${type}/${this.param_str}`, { params: identifier })
	}

	public async create_tournament() { }

	public async get_tournament(tournament_id: UUIDv4) {
		return this.api_request<Users>("GET", "Tournaments", `/TournamentID/${this.param_str}`, { params: tournament_id })

	}

	public async get_matchlist(): Promise<at.AxiosResponse<Array<Match>>> {
		return this.api_request<Array<Match>>("GET", "Matches", "/multiget")
	}

	private async get_player_matchlist_from_uuid(user: UUIDv4): Promise<at.AxiosResponse<Array<Match>>> {
		return this.api_request<Array<Match>>("GET", "Matches", `/PlayerID/${this.param_str}`, { params: user })
	}

	private async get_player_matchlist_from_user(user: Users): Promise<at.AxiosResponse<Array<Match>>> {
		if (!user.PlayerID)
			throw "error.empty.playerid"
		return this.get_player_matchlist_from_uuid(user.PlayerID)
	}

	public async get_player_matchlist(user: UUIDv4 | Users): Promise<at.AxiosResponse<Array<Match>>> {
		if (typeof user === "string")
			return this.get_player_matchlist_from_uuid(user)
		return this.get_player_matchlist_from_user(user)
	}

	public async create_match(match: Match) { }

	public async get_match(match_id: UUIDv4) {
		return this.api_request<Users>("GET", "Matches", `/MatchID/${this.param_str}`, { params: match_id })
	}
}
