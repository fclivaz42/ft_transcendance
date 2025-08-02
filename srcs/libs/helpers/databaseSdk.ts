// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   databaseSdk.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/25 19:14:30 by fclivaz           #+#    #+#             //
//   Updated: 2025/08/03 00:54:24 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import axios from "axios";
import https from "https";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import type * as fft from "fastify";
import { default_users, type User } from "../interfaces/User.ts";
import type { Match, Match_complete } from "../interfaces/Match.ts";
import type { Tournament_full, Tournament_lite, Tournament_metadata } from "../interfaces/Tournament.ts";
import BlockchainSDK from "./blockchainSdk.ts";
import UsersSdk from "./usersSdk.ts";
import type { TXHash } from "./blockchainSdk.ts";
import { httpReply } from "./httpResponse.ts";

export type UUIDv4 = string

interface db_sdk_options {
	params?: string;
	headers?: Record<string, string>;
	response_type?: "arraybuffer" | "blob" | "json" | "text" | "stream" | "document" | "formdata"
	body?: any
}

interface comb {
	merged: Match,
	uarray: Array<User>
}

export interface DatabaseSdkConfig {
	apiKey: string;
	serverUrl: string;
}

export const defaultConfig: DatabaseSdkConfig = {
	apiKey: process.env.API_KEY || "",
	serverUrl: process.env.DATABASE_URL || "https://database:3000"
}

export default class DatabaseSDK {
	private _config: DatabaseSdkConfig = defaultConfig;

	private param_str = "{?PARAMS}"
	private bc_sdk = new BlockchainSDK();
	private usr_sdk = new UsersSdk();

	constructor(config?: DatabaseSdkConfig) {
		this._config = config || defaultConfig;
	}

	private async api_request<T>(method: "GET" | "POST" | "PUT" | "DELETE", table: "Players" | "Matches" | "Tournaments" | "CurrentContract", endpoint?: string, options?: db_sdk_options): Promise<AxiosResponse<T>> {
		if (options?.body) {
			if (!options.headers)
				options.headers = {};
		}
		const httpsAgent = new https.Agent({ rejectUnauthorized: !(process.env.IGNORE_TLS?.toLowerCase() === "true") });

		let url = `${this._config.serverUrl}/${table}`
		if (endpoint)
			url = url + endpoint
		if (endpoint && options?.params)
			url = url.replace(this.param_str, options?.params)
		return axios({
			httpsAgent,
			method,
			url,
			headers: {
				Authorization: this._config.apiKey,
				...options?.headers,
			},
			data: options?.body,
			responseType: options?.response_type
		}).catch((err: AxiosError) => {
			if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN')
				err.status = 503;
			throw err;
		})
	}

	private async validate_match(val_match: Match): Promise<comb> {
		let merged: Match | undefined = undefined;
		if (val_match.HashAddress) {
			await this.bc_sdk.get_match_score(val_match.MatchID as string)
				.then(function(response) {
					merged = { ...val_match, ...response }
				})
				.catch(function() { val_match.HashAddress = undefined })
		}
		if (merged) {
			if (!val_match.WPlayerID)
				(merged as Partial<Match>).WPlayerID = undefined
			if (!val_match.LPlayerID)
				(merged as Partial<Match>).LPlayerID = undefined
		}
		else
			merged = val_match
		const uarray: User[] = [];
		try {
			uarray[0] = this.usr_sdk.filterPublicUserData((await this.usr_sdk.getUser(merged.WPlayerID as string)).data) as User;
		} catch (exception) {
			if (exception instanceof AxiosError && exception.status === 404)
				uarray[0] = default_users.Deleted as User;
			else
				throw exception;
		}
		try {
			uarray[1] = this.usr_sdk.filterPublicUserData((await this.usr_sdk.getUser(merged.LPlayerID as string)).data) as User;
		} catch (exception) {
			if (exception instanceof AxiosError && exception.status === 404)
				uarray[1] = default_users.Deleted as User;
			else
				throw exception;
		}
		return {
			merged,
			uarray
		}
	}

	private async validate_matchlist(matchlist: Array<Match>) {
		await Promise.all(matchlist.map(async (item) => {
			let combd: comb = await this.validate_match(item)
			Object.assign(item, combd.merged)
			item.WPlayerID = combd.uarray[0]
			item.LPlayerID = combd.uarray[1]
		}));
		matchlist.sort((a: Match, b: Match) => {
			if (a.StartTime > b.StartTime)
				return -1;
			if (a.StartTime < b.StartTime)
				return 1;
			return 0;
		})
	}

	private async get_player_matchlist_from_uuid(user: UUIDv4): Promise<Array<Match_complete>> {
		const matchlist: Array<Match> = await this.api_request<Array<Match>>("GET", "Matches", `/PlayerID/${this.param_str}`, { params: user })
			.then(response => response.data)
		await this.validate_matchlist(matchlist)
		return matchlist as Array<Match_complete>
	}

	private async get_player_matchlist_from_user(user: User): Promise<Array<Match_complete>> {
		if (!user.PlayerID)
			throw "error.missing.playerid"
		return await this.get_player_matchlist_from_uuid(user.PlayerID) as Array<Match_complete>
	}

	private async get_friends_from_user(user: User): Promise<Array<User>> {
		if (!user.FriendsList)
			return []
		const ret: Array<User> = await this.api_request<Array<User>>("GET", "Players", "/multiget", {
			headers: {
				Field: "PlayerID",
				Array: JSON.stringify(user.FriendsList)
			}
		}).then(response => response.data)
		for (const item in ret)
			ret[item] = this.usr_sdk.filterPublicUserData(ret[item]) as User
		return ret;
	}

	private async get_friends_from_uuid(user: UUIDv4): Promise<Array<User>> {
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
	public async get_user_friends(user: UUIDv4 | User): Promise<Array<User>> {
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
		await this.validate_matchlist(matchlist)
		return matchlist as Array<Match_complete>
	}

	/**
	* Get the complete list of matches in which the User is present.
	* @param user The UUIDv4 of the User or the User object.
	* @returns An AxiosResponse Promise containing an array of every single Match.
	*/
	public async get_player_matchlist(user: UUIDv4 | User): Promise<Array<Match_complete>> {
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
			.catch(() => { throw "error.database.down" })
		const match_tx: TXHash = await this.bc_sdk.add_match_score(finished_match)
			.then(response => response.data)
			.catch(() => { throw "error.blockchain.down" })
		return await this.api_request<Match>("PUT", "Matches", `/MatchID/${this.param_str}`, { body: { HashAddress: match_tx }, params: finished_match.MatchID })
	}

	/**
	* Get the complete match data.
	* @param match_id The UUIDv4 string of the match you are trying to get.
	* @returns An Promise containing the complete Match data.
	*/
	public async get_match(match_id: UUIDv4): Promise<Match_complete> {
		const match: Match = await this.api_request<Match>("GET", "Matches", `/MatchID/${this.param_str}`, { params: match_id })
			.then(response => response.data)
		let combd: comb = await this.validate_match(match)
		return {
			...combd.merged,
			WPlayerID: combd.uarray[0],
			LPlayerID: combd.uarray[1]
		}
	}
}
