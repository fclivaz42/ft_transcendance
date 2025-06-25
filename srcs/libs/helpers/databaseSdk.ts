// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   databaseSdk.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/25 19:14:30 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/25 19:14:34 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

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

export default class DatabaseSDK {

	private api_key = process.env.API_KEY
	private server_url = "http://database:3000"
	private param_str = "{?PARAMS}"

	constructor() { }

	private async api_request<T>(method: "GET" | "POST" | "PUT" | "DELETE", table: "Players" | "Matches" | "Tournaments" | "CurrentContract", endpoint?: string, options?: db_sdk_options): Promise<AxiosResponse<T>> {
		if (options?.body) {
			if (!options.headers)
				options.headers = {};
			if (!options.headers["Content-Type"])
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

	public async create_user(user: User): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("POST", "Players", undefined, { body: user })
	}

	public async get_user(identifier: string, type: "PlayerID" | "DisplayName" | "EmailAddress" | "OAuthID"): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}`, { params: identifier })
	}

	public async update_user(user: User): Promise<AxiosResponse<User>> {
		if (!user.PlayerID)
			throw "error.missing.playerid"
		return await this.api_request<User>("PUT", "Players", `/PlayerID/${this.param_str}`, { body: user, params: user.PlayerID })
	}

	public async delete_user(user: UUIDv4): Promise<AxiosResponse<string>> {
		return await this.api_request<string>("DELETE", "Players", `/PlayerID/${this.param_str}`, { params: user })
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

	public async get_user_picture(identifier: UUIDv4): Promise<AxiosResponse<File>> {
		return await this.api_request<File>("GET", "Players", `/PlayerID/${this.param_str}/picture`, { params: identifier })
	}

	public async set_user_picture(identifier: UUIDv4, picture: File): Promise<AxiosResponse<File>> {
		let data = new FormData();
		data.append("image", picture)
		console.dir(data)
		return await this.api_request<File>("POST", "Players", `/PlayerID/${this.param_str}/picture`, { params: identifier, body: data, headers: { "Content-Type": "multipart/form-data" } })
	}

	public async log_user(query: string, type: "PlayerID" | "DisplayName" | "EmailAddress", plaintext: string): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}/check_passwd`, {
			params: query,
			headers: {
				Password: plaintext
			}
		})
	}

	// WARN: DOUBLE-CHECK THIS
	public async create_tournament(tournament: Tournament_metadata) {
		return await this.api_request<Tournament_metadata>("POST", "Tournaments", undefined, { body: tournament })
	}

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

	// WARN: DOUBLE-CHECK THIS
	public async create_match(match: Match) {
		return await this.api_request<Match>("POST", "Matches", undefined, { body: match })
	}

	public async get_match(match_id: UUIDv4) {
		return await this.api_request<User>("GET", "Matches", `/MatchID/${this.param_str}`, { params: match_id })
	}
}
