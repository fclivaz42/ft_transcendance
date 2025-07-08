// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   databaseSdk.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/25 19:14:30 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/08 08:05:50 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import axios from "axios";
import https from "https";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type * as fft from "fastify";
import type { User } from "../interfaces/User.ts";
import type { Match, Match_complete } from "../interfaces/Match.ts";
import type { Tournament_full, Tournament_lite, Tournament_metadata } from "../interfaces/Tournament.ts";
import BlockchainSDK from "./blockchainSdk.ts";
import type { TXHash } from "./blockchainSdk.ts";

export type UUIDv4 = string

interface db_sdk_options {
	params?: string;
	headers?: Record<string, string>;
	response_type?: "arraybuffer" | "blob" | "json" | "text" | "stream" | "document" | "formdata"
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
			responseType: options?.response_type
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

	private async get_player_matchlist_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<Match>>> {
		return await this.api_request<Array<Match>>("GET", "Matches", `/PlayerID/${this.param_str}`, { params: user })
	}

	private async get_player_matchlist_from_user(user: Partial<User>): Promise<AxiosResponse<Array<Match>>> {
		if (!user.PlayerID)
			throw "error.missing.playerid"
		return await this.get_player_matchlist_from_uuid(user.PlayerID)
	}

	private async get_friends_from_uuid(user: UUIDv4): Promise<AxiosResponse<Array<User>>> {
		const req_user: User = (await this.get_user(user, "PlayerID")).data
		return await this.get_friends_from_user(req_user)
	}

	public async get_current_contract(): Promise<AxiosResponse<string>> {
		return await this.api_request("GET", "CurrentContract", undefined)
	}

	/**
	* Create a new user in the database.
	* @param user The user you want to create (object).
	* @returns An AxiosResponse Promise containing the created User's complete data
	*/
	public async create_user(user: User): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("POST", "Players", undefined, { body: user })
	}

	/**
	* Get a user's complete data from the database.
	* @param identifier The string used to identify the user by the second parameter.
	* @param type The type of the identifier. Can be one of the following: "PlayerID" | "DisplayName" | "EmailAddress" | "OAuthID"
	* @returns An AxiosResponse Promise containing the User's complete data. Throws in case the user was not found.
	*/
	public async get_user(identifier: string, type: "PlayerID" | "DisplayName" | "EmailAddress" | "OAuthID"): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}`, { params: identifier })
	}

	/**
	* Update a User's information
	* @param user The user you want to update. The PlayerID Field is mandatory!
	* @returns An AxiosResponse Promise containing the created User's complete data. Throws in case the user was not found.
	*/
	public async update_user(user: Partial<User>): Promise<AxiosResponse<User>> {
		if (!user.PlayerID)
			throw "error.missing.playerid"
		return await this.api_request<User>("PUT", "Players", `/PlayerID/${this.param_str}`, { body: user, params: user.PlayerID })
	}

	/**
	* Delete a user from SARIF.
	* @param user the UUIDv4 string of the user.
	* @returns An AxiosResponse Promise containing a string (the SQL result.) Throws in case the user was not found.
	*/
	public async delete_user(user: UUIDv4): Promise<AxiosResponse<string>> {
		return await this.api_request<string>("DELETE", "Players", `/PlayerID/${this.param_str}`, { params: user })
	}

	/**
	* Get the friends data of a specific user.
	* @param user Either an UUIDv4 string or User object.
	* @returns An AxiosResponse Promise containing an array of Users, those being the friends.
	*/
	public async get_user_friends(user: UUIDv4 | User): Promise<AxiosResponse<Array<User>>> {
		if (typeof user === "string")
			return await this.get_friends_from_uuid(user)
		return await this.get_friends_from_user(user)
	}

	/**
	* Get the profile picture from a certain user.
	* @param identifier The user's UUIDv4 string.
	* @returns An AxiosResponse Promise containing a File.
	*/
	public async get_user_picture(identifier: UUIDv4): Promise<AxiosResponse<ArrayBuffer>> {
		return await this.api_request<ArrayBuffer>("GET", "Players", `/PlayerID/${this.param_str}/picture`, { params: identifier, response_type: "arraybuffer" })
	}

	/**
	* Get the profile picture from a certain user.
	* @param identifier The user's UUIDv4 string.
	* @param picture FormData containing the picture.
	* @returns An AxiosResponse Promise containing a File.
	*/
	public async set_user_picture(identifier: UUIDv4, picture: FormData): Promise<AxiosResponse<ArrayBuffer>> {
		return await this.api_request<ArrayBuffer>("POST", "Players", `/PlayerID/${this.param_str}/picture`, { params: identifier, body: picture, response_type: "arraybuffer" })
	}

	/**
	* Checks the given password against the one provided by query.
	* @param identifier The string used to identify the user by the second parameter.
	* @param type The type of the identifier. Can be one of the following: "PlayerID" | "DisplayName" | "EmailAddress" | "OAuthID"
	* @param plaintext The password in plaintext.
	* @returns An AxiosResponse Promise containing the user or the object { skill: "issue" } if the check fails. (And throws in case it fails)
	*/
	public async log_user(identifier: string, type: "PlayerID" | "DisplayName" | "EmailAddress", plaintext: string): Promise<AxiosResponse<User>> {
		return await this.api_request<User>("GET", "Players", `/${type}/${this.param_str}/check_passwd`, {
			params: identifier,
			headers: {
				Password: plaintext
			}
		})
	}

	// WARN: DOUBLE-CHECK THIS
	public async create_tournament(tournament: Tournament_metadata) {
		return await this.api_request<Tournament_metadata>("POST", "Tournaments", undefined, { body: tournament })
	}

	/**
	* Get the complete tournament data.
	* @param tournament_id The UUIDv4 string of the tournament you are trying to get.
	* @returns An AxiosResponse Promise containing the complete Tournament data.
	*/
	public async get_tournament(tournament_id: UUIDv4): Promise<AxiosResponse<Tournament_full>> {
		return await this.api_request<Tournament_full>("GET", "Tournaments", `/TournamentID/${this.param_str}`, { params: tournament_id })
	}

	/**
	* Get the complete list of matches present in the database.
	* @returns An AxiosResponse Promise containing an array of every single Match.
	*/
	public async get_matchlist(): Promise<Array<Match_complete>> {
		const matchlist: Array<Match> = await this.api_request<Array<Match>>("GET", "Matches", "/multiget")
			.then(response => response.data)
		for (const item of matchlist) {
			let merged: Match | undefined = undefined;
			if (item.HashAddress) {
				const bc_sdk = new BlockchainSDK();
				await bc_sdk.get_match_score(item.MatchID as string)
					.then(function(response) {
						merged = { ...item, ...response }
					})
					.catch(function() { item.HashAddress = undefined })
			}
			if (merged) {
				if (!item.WPlayerID)
					(merged as Partial<Match>).WPlayerID = undefined
				if (!item.LPlayerID)
					(merged as Partial<Match>).LPlayerID = undefined
			}
			else
				merged = item
			const u_array: Array<User> = await this.api_request<Array<User>>("GET", "Players", "/multiget", {
				headers: {
					Field: "PlayerID",
					Array: JSON.stringify([merged.WPlayerID, merged.LPlayerID])
				}
			}).then(response => response.data)
			Object.assign(item, merged)
			item.WPlayerID = u_array[0]
			item.LPlayerID = u_array[1]
		}
		return matchlist as Array<Match_complete>
	}

	/**
	* Get the complete list of matches in which the User is present.
	* @param user The UUIDv4 of the User or the User object.
	* @returns An AxiosResponse Promise containing an array of every single Match.
	*/
	public async get_player_matchlist(user: UUIDv4 | User): Promise<AxiosResponse<Array<Match>>> {
		if (typeof user === "string")
			return await this.get_player_matchlist_from_uuid(user)
		return await this.get_player_matchlist_from_user(user)
	}

	/**
	* Create a new user on the database and, additionnally, store it on the Blockchain.
	* @param match the Match object with its data.
	* @returns the created match with the input data. Throws if anything fails.
	*/
	public async create_match(match: Match): Promise<AxiosResponse<Match>> {
		const finished_match: Match = await this.api_request<Match>("POST", "Matches", undefined, { body: match })
			.then(response => response.data)
		const bc_sdk = new BlockchainSDK();
		const match_tx: TXHash = await bc_sdk.add_match_score(finished_match)
			.then(response => response.data)
		return await this.api_request<Match>("PUT", "Matches", `/MatchID/${this.param_str}`, { body: { HashAddress: match_tx }, params: finished_match.MatchID })
	}

	/**
	* Get the complete match data.
	* @param match_id The UUIDv4 string of the match you are trying to get.
	* @returns An AxiosResponse Promise containing the complete Match data.
	*/
	public async get_match(match_id: UUIDv4): Promise<Match_complete> {
		const match: Match = await this.api_request<Match>("GET", "Matches", `/MatchID/${this.param_str}`, { params: match_id })
			.then(response => response.data)
		let merged: Match | undefined = undefined;
		if (match.HashAddress) {
			const bc_sdk = new BlockchainSDK();
			await bc_sdk.get_match_score(match.MatchID as string)
				.then(function(response) {
					merged = { ...match, ...response }
				})
				.catch(function() { match.HashAddress = undefined })
		}
		if (merged) {
			if (!match.WPlayerID)
				(merged as Partial<Match>).WPlayerID = undefined
			if (!match.LPlayerID)
				(merged as Partial<Match>).LPlayerID = undefined
		}
		else
			merged = match
		const u_array: Array<User> = await this.api_request<Array<User>>("GET", "Players", "/multiget", {
			headers: {
				Field: "PlayerID",
				Array: JSON.stringify([merged.WPlayerID, merged.LPlayerID])
			}
		}).then(response => response.data)
		return {
			...merged,
			WPlayerID: u_array[0],
			LPlayerID: u_array[1]
		}
	}
}
