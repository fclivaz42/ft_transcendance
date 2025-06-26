import axios from "axios";
import https from "https";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { Match, Match_complete } from "../interfaces/Match.ts";
import type { Tournament_full, Tournament_lite, Tournament_metadata } from "../interfaces/Tournament.ts";

export type UUIDv4 = string

export type ContractHash = string

interface bc_sdk_options {
	params?: string;
	timeout?: number;
	headers?: Record<string, string>;
	body?: any
}

export default class BlockchainSDK {

	private api_key = process.env.API_KEY
	private server_url = "http://blockchain:8080"
	private param_str = "{?PARAMS}"

	constructor() { }

	private async api_request<T>(method: "GET" | "POST", route: "add-match-score" | "add-tournament-score" | "deploy" | "match-score" | "tournament-match-score" | "tournament-scores", endpoint?: string, options?: bc_sdk_options): Promise<AxiosResponse<T>> {
		if (options?.body) {
			if (!options.headers)
				options.headers = {};
		}
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });

		let url = `${this.server_url}/${route}`
		if (endpoint)
			url = url + endpoint
		if (endpoint && options?.params)
			url = url.replace(this.param_str, options?.params)
		return await axios({
			httpsAgent,
			method,
			url,
			timeout: options?.timeout,
			headers: {
				Authorization: this.api_key,
				...options?.headers,
			},
			data: options?.body,
		})
	}
	;
	public async deploy(hash: string | undefined): Promise<AxiosResponse<ContractHash>> {
		if (hash === undefined)
			return await this.api_request<ContractHash>("POST", "deploy", undefined, { body: "", timeout: 15000, headers: { "Content-Type": "application/json" } })
		return await this.api_request<ContractHash>("POST", "deploy", undefined, { body: hash, timeout: 15000, headers: { "Content-Type": "application/json" } })
	}
	//
	// private async get_player_matchlist_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<Match>>> {
	// 	return await this.api_request<Array<Match>>("GET", "Matches", `/PlayerID/${this.param_str}`, { params: user, timeout: 15000 })
	// }
	//
	// private async get_player_matchlist_from_user(user: User): Promise<AxiosResponse<Array<Match>>> {
	// 	if (!user.PlayerID)
	// 		throw "error.empty.playerid"
	// 	return await this.get_player_matchlist_from_uuid(user.PlayerID)
	// }
	//
	// private async get_friends_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<User>>> {
	// 	const req_user: User = (await this.get_user(user, "PlayerID")).data
	// 	return await this.get_friends_from_user(req_user)
	// }
	//
	// /**
	// * Create a new user in the database.
	// * @param user The user you want to create (object).
	// * @returns An AxiosResponse Promise containing the created User's complete data
	// */
	// public async create_user(user: User): Promise<AxiosResponse<User>> {
	// 	return await this.api_request<User>("POST", "Players", undefined, { body: user })
	// }
}
