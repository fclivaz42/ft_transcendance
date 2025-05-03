import dotenv from "dotenv";
import crypto from "crypto";

class ServerConfig {
	private _port: number;
	private _logger: boolean;
	private _api_key: string;

	constructor() {
		if (!process.env.OAUTH_PORT) {
			console.warn("Missing OAUTH_PORT env, using default port 3000");
			process.env.OAUTH_PORT = "3000";
		}
		this._port = parseInt(process.env.OAUTH_PORT);
		if (isNaN(this._port)) throw new Error("OAUTH_PORT must be an integer");
		if (!process.env.OAUTH_LOGGER) {
			console.warn("Missing OAUTH_LOGGER env, using default 'true'");
			process.env.OAUTH_LOGGER = "true";
		}
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
	private _authorization_ep: string;
	private _token_ep: string;
	private _client_id: string;
	private _secret: string;
	private _scope: string;
	private _grant_type: string;

	constructor() {
		if (!process.env.OAUTH_CALLBACK) throw new Error("Missing OAUTH_CALLBACK env");
		this._callback = process.env.OAUTH_CALLBACK;
		if (!process.env.OAUTH_AUTHORIZATION_EP) throw new Error("Missing OAUTH_AUTHORIZATION_EP env");
		this._authorization_ep = process.env.OAUTH_AUTHORIZATION_EP;
		if (!process.env.OAUTH_TOKEN_EP) throw new Error("Missing OAUTH_TOKEN_EP env");
		this._token_ep = process.env.OAUTH_TOKEN_EP;
		if (!process.env.OAUTH_SCOPE) throw new Error("Missing OAUTH_SCOPE env");
		this._scope = process.env.OAUTH_SCOPE;
		if (!process.env.OAUTH_GRANT_TYPE) throw new Error("Missing OAUTH_GRANT_TYPE env");
		this._grant_type = process.env.OAUTH_GRANT_TYPE;
		if (!process.env.OAUTH_CLIENT_ID) throw new Error("Missing OAUTH_CLIENT_ID env");
		this._client_id = process.env.OAUTH_CLIENT_ID;
		if (!process.env.OAUTH_SECRET) throw new Error("Missing OAUTH_SECRET env");
		this._secret = process.env.OAUTH_SECRET;
	}

	public get callback() : string { return this._callback; }
	public get authorization_ep() : string { return this._authorization_ep; }
	public get token_ep() : string { return this._token_ep; }
	public get client_id(): string { return this._client_id; }
	public get secret(): string { return this._secret; }
	public get scope(): string { return this._scope; }
	public get grant_type(): string { return this._grant_type; }
	
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
