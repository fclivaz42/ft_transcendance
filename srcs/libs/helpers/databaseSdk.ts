import axios from "axios";
import type * as at from "axios";
import type * as fft from "fastify";

export type UUIDv4 = string

export default class databaseSdk {

	private _api_key = process.env.API_KEY
	private serverUrl = "https://sarif_usermanager:3000"

	constructor() { }

	public async get_matchlist() {

	}

	public async get_player_matchlist(uuid: UUIDv4) {

	}

	public async get_user_friends(uuid: UUIDv4) {

	}

	public async get_user_picture(uuid: UUIDv4) {

	}

	public async set_user_picture(uuid: UUIDv4, picture) {

	}

	public async check_password(query: string, plaintext: string) {

	}

	public async create_user() { }
}
