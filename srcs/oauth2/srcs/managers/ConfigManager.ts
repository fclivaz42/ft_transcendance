import dotenv from "dotenv";

class ServerConfig {
	private _port: number;
	private _logger: boolean;

	constructor() {
		if (!process.env.OAUTH_PORT) throw new Error("Missing OAUTH_PORT env");
		this._port = parseInt(process.env.OAUTH_PORT);
		if (isNaN(this._port)) throw new Error("OAUTH_PORT must be an integer");
		if (!process.env.OAUTH_LOGGER) throw new Error("Missing OAUTH_LOGGER env");
		this._logger = process.env.OAUTH_LOGGER.toLowerCase() === "true";
	}

	public get port(): number { return this._port; }
	public get logger(): boolean { return this._logger; }
}

class OauthConfig {
	private _redirect: string;
	private _authorization: string;
	private _client_id: string;
	private _secret: string;

	constructor() {
		if (!process.env.OAUTH_REDIRECT) throw new Error("Missing OAUTH_REDIRECT env");
		this._redirect = process.env.OAUTH_REDIRECT;
		if (!process.env.OAUTH_AUTHORIZATION) throw new Error("Missing OAUTH_AUTHORIZATION env");
		this._authorization = process.env.OAUTH_AUTHORIZATION;
		if (!process.env.OAUTH_CLIENT_ID) throw new Error("Missing OAUTH_CLIENT_ID env");
		this._client_id = process.env.OAUTH_CLIENT_ID;
		if (!process.env.OAUTH_SECRET) throw new Error("Missing OAUTH_SECRET env");
		this._secret = process.env.OAUTH_SECRET;
	}

	public get redirect() : string { return this._redirect; }
	public get authorization() : string { return this._authorization; }
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

export default ConfigManager;
