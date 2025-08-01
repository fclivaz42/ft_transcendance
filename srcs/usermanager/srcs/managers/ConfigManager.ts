import dotenv from "dotenv";
import crypto from "crypto";
import Logger from "../../../libs/helpers/loggers.ts";

class ServerConfig {
	private _port: number;
	private _api_key: string;
	private _cert: {
		_KEY_PATH: string;
		_CERT_PATH: string;
	}

	constructor() {
		if (!process.env.USERMANAGER_PORT) {
			Logger.warn("Missing USERMANAGER_PORT env, using default port 3000");
			process.env.USERMANAGER_PORT = "3000";
		}
		this._port = parseInt(process.env.USERMANAGER_PORT);
		if (isNaN(this._port)) throw new Error("USERMANAGER_PORT must be an integer");
		if (!process.env.API_KEY) {
			Logger.warn("Missing API_KEY env, setting a random key...");
			process.env.API_KEY = crypto.randomBytes(32).toString("hex");
			Logger.info(`API_KEY for Authorization header: ${process.env.API_KEY}`)
		}
		this._api_key = process.env.API_KEY;
		if (!process.env.KEY_PATH || !process.env.CERT_PATH) {
			Logger.warn("Missing KEY_PATH or CERT_PATH env, using default paths: /etc/ssl/private/sarif.key and /etc/ssl/certs/sarif.crt");
			this._cert = {
				_KEY_PATH: "/etc/ssl/private/sarif.key",
				_CERT_PATH: "/etc/ssl/certs/sarif.crt",
			};
		} else {
			this._cert = {
				_KEY_PATH: process.env.KEY_PATH,
				_CERT_PATH: process.env.CERT_PATH,
			};
		}
		Logger.warn(`Loading certificate and key from ${this._cert._CERT_PATH} and ${this._cert._KEY_PATH}`);
	}

	public get port(): number { return this._port; }
	public get api_key(): string { return this._api_key; }
	public get cert(): { _KEY_PATH: string; _CERT_PATH: string } {
		return {
			_KEY_PATH: this._cert._KEY_PATH,
			_CERT_PATH: this._cert._CERT_PATH
		};
	}
}

class UsermanagerConfig {
	private _issuer: string;
	private _secret: string;
	private _ttl: number;

	constructor() {
		if (!process.env.USERMANAGER_JWT_ISSUER) {
			Logger.warn("Missing USERMANAGER_ISSUER env, using default 'sarif.usermanager'");
			process.env.USERMANAGER_JWT_ISSUER = "sarif.usermanager";
		}
		this._issuer = process.env.USERMANAGER_JWT_ISSUER;

		if (!process.env.USERMANAGER_JWT_SECRET) {
			Logger.warn("Missing USERMANAGER_JWT_SECRET env, using a random secret");
			process.env.USERMANAGER_JWT_SECRET = crypto.randomBytes(32).toString("hex");
			Logger.info(`USERMANAGER_JWT_SECRET for signing tokens: ${process.env.USERMANAGER_JWT_SECRET}`);
		}
		this._secret = process.env.USERMANAGER_JWT_SECRET;

		if (!process.env.USERMANAGER_JWT_TTL) {
			Logger.warn("Missing USERMANAGER_JWT_TTL env, using default 3600 seconds");
			process.env.USERMANAGER_JWT_TTL = "3600";
		}
		this._ttl = parseInt(process.env.USERMANAGER_JWT_TTL);
		if (isNaN(this._ttl) || this._ttl <= 0) {
			throw new Error("USERMANAGER_JWT_TTL must be a positive integer");
		}
	}

	public get issuer(): string { return this._issuer; }
	public get secret(): string { return this._secret; }
	public get ttl(): number { return this._ttl; }
}

class SmtpConfig {
	private _from: string;
	private _host: string | undefined;
	private _service: string | undefined;
	private _port: number;
	private _secure: boolean;
	private _auth: {
		user: string;
		pass: string;
	}

	constructor() {
		if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) {
			Logger.error("Missing SMTP_HOST and SMTP_SERVICE env. One of them is required.");
			throw new Error("SMTP_HOST or SMTP_SERVICE must be defined");
		}
		this._host = process.env.SMTP_HOST;
		this._service = process.env.SMTP_SERVICE;
		if (!process.env.SMTP_PORT) {
			Logger.warn("Missing SMTP_PORT env, using default port 465");
			process.env.SMTP_PORT = "465";
		}
		this._port = parseInt(process.env.SMTP_PORT);
		if (isNaN(this._port) || this._port <= 0) {
			throw new Error("SMTP_PORT must be a positive integer");
		}
		if (!process.env.SMTP_TLS) {
			Logger.warn("Missing SMTP_TLS env, using default true");
			process.env.SMTP_TLS = "true";
		}
		this._secure = process.env.SMTP_TLS.toLowerCase() === "true";
		if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
			Logger.error("Missing SMTP_USER or SMTP_PASS env. Both are required.");
			throw new Error("SMTP_USER and SMTP_PASS must be defined");
		}
		this._auth = {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		};
		if (!process.env.SMTP_FROM) {
			Logger.warn("Missing SMTP_FROM env, using SMTP_USER as default sender");
			process.env.SMTP_FROM = this._auth.user;
		}
		this._from = process.env.SMTP_FROM;
	}

	public get host(): string | undefined { return this._host; }
	public get service(): string | undefined { return this._service; }
	public get port(): number { return this._port; }
	public get secure(): boolean { return this._secure; }
	public get auth(): { user: string; pass: string } {
		return {
			user: this._auth.user,
			pass: this._auth.pass
		};
	}
	public get from(): string { return this._from; }
}

class ConfigManager {
	private _serverconfig: ServerConfig;
	private _oauthconfig: UsermanagerConfig;
	private _smtpconfig: SmtpConfig;

	public get ServerConfig(): ServerConfig { return this._serverconfig; }
	public get UsermanagerConfig(): UsermanagerConfig { return this._oauthconfig; }
	public get SmtpConfig(): SmtpConfig { return this._smtpconfig; }

	constructor() {
		dotenv.config();
		this._serverconfig = new ServerConfig();
		this._oauthconfig = new UsermanagerConfig();
		this._smtpconfig = new SmtpConfig();
	}
}

export const config = new ConfigManager();
