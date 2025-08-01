import axios from "axios";
import https from "https";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { Match, Match_complete } from "../interfaces/Match.ts";
import type { Tournament_full, Tournament_lite, Tournament_metadata } from "../interfaces/Tournament.ts";
import type { blockMatch } from "../interfaces/Blockchain.ts";

export type UUIDv4 = string

export type ContractHash = string

export type TXHash = string

interface bc_sdk_options {
	params?: string;
	timeout?: number;
	headers?: Record<string, string>;
	body?: any
}

export default class BlockchainSDK {

	private api_key = process.env.API_KEY
	private server_url = "https://blockchain:8080"
	private param_str = "{?PARAMS}"

	constructor() { }

	private async api_request<T>(method: "GET" | "POST", route: "add-match-score" | "add-tournament-score" | "deploy" | "match-score" | "tournament-match-score" | "tournament-scores", endpoint?: string, options?: bc_sdk_options): Promise<AxiosResponse<T>> {
		if (options?.body) {
			if (!options.headers)
				options.headers = {};
		}
		const httpsAgent = new https.Agent({ rejectUnauthorized:  !(process.env.IGNORE_TLS?.toLowerCase() === "true") });

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

	private switcheroo(finished_match: Match): blockMatch {
		return {
			id: finished_match.MatchID,
			winner: finished_match.WPlayerID as string,
			loser: finished_match.LPlayerID as string,
			winnerScore: finished_match.WScore,
			loserScore: finished_match.LScore
		}
	}

	private rectify(b_match: blockMatch): Partial<Match> {
		return {
			MatchID: b_match.id,
			WPlayerID: b_match.winner,
			LPlayerID: b_match.loser,
			WScore: b_match.winnerScore,
			LScore: b_match.loserScore
		}
	}

	public async deploy(hash: string | undefined): Promise<AxiosResponse<ContractHash>> {
		if (hash === undefined)
			return await this.api_request<ContractHash>("POST", "deploy", undefined, { body: "", timeout: 15000, headers: { "Content-Type": "application/json" } })
		return await this.api_request<ContractHash>("POST", "deploy", undefined, { body: hash, timeout: 15000, headers: { "Content-Type": "application/json" } })
	}

	public async add_match_score(finished_match: Match): Promise<AxiosResponse<TXHash>> {
		if (typeof finished_match.WPlayerID !== "string" || typeof finished_match.LPlayerID !== "string")
			throw "One of the PlayerID's is not a string."
		return await this.api_request<TXHash>("POST", "add-match-score", undefined, { body: this.switcheroo(finished_match), timeout: 15000 })
	}

	public async get_match_score(identifier: UUIDv4): Promise<Partial<Match>> {
		const req: blockMatch = await this.api_request<blockMatch>("GET", "match-score", `/id/${this.param_str}`, { params: identifier })
			.then(response => response.data)
		req.id = identifier
		return this.rectify(req)
	}
}
