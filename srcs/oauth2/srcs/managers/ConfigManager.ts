import dotenv from "dotenv";
import crypto from "crypto";

class ServerConfig {
	private _port: number;
	private _logger: boolean;
	private _api_key: string;

	constructor() {
		if (!process.env.OAUTH_PORT) throw new Error("Missing OAUTH_PORT env");
		this._port = parseInt(process.env.OAUTH_PORT);
		if (isNaN(this._port)) throw new Error("OAUTH_PORT must be an integer");
		if (!process.env.OAUTH_LOGGER) throw new Error("Missing OAUTH_LOGGER env");
		this._logger = process.env.OAUTH_LOGGER.toLowerCase() === "true";
		if (!process.env.API_KEY) {
			console.warn("Missing API_KEY env, setting a random key...");
			process.env.API_KEY = crypto.randomBytes(32).toString("hex");
			console.info(`API_KEY for Authorization header: ${process.env.API_KEY}`)	
		}
		this._api_key = process.env.API_KEY;
	}

	public get port(): number { return this._port; }
	public get logger(): boolean { return this._logger; }
	public get api_key(): string { return this._api_key; }
}

class OauthConfig {
	private _callback: string;
	private _server: string;
	private _client_id: string;
	private _secret: string;

	constructor() {
		if (!process.env.OAUTH_CALLBACK) throw new Error("Missing OAUTH_CALLBACK env");
		this._callback = process.env.OAUTH_CALLBACK;
		if (!process.env.OAUTH_SERVER) throw new Error("Missing OAUTH_SERVER env");
		this._server = process.env.OAUTH_SERVER;
		if (!process.env.OAUTH_CLIENT_ID) throw new Error("Missing OAUTH_CLIENT_ID env");
		this._client_id = process.env.OAUTH_CLIENT_ID;
		if (!process.env.OAUTH_SECRET) throw new Error("Missing OAUTH_SECRET env");
		this._secret = process.env.OAUTH_SECRET;
	}

	public get callback() : string { return this._callback; }
	public get server() : string { return this._server; }
	public get client_id(): string { return this._client_id; }
	public get secret(): string { return this._secret; }
	
}

class ConfigManager {
	private _serverconfig: ServerConfig;
	private _oauthconfig: OauthConfig;

	public get ServerConfig() : ServerConfig { return this._serverconfig; }
	public get OauthConfig() : OauthConfig { return this._oauthconfig; }

	constructor() {
		dotenv.config();
		this._serverconfig = new ServerConfig();
		this._oauthconfig = new OauthConfig();
	}
}

export const config = new ConfigManager();
