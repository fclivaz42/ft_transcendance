import dotenv from "dotenv";
import crypto from "crypto";

class ServerConfig {
  private _port: number;
  private _logger: boolean;
  private _api_key: string;
  private _cert: {
    _keypath: string;
    _certpath: string;
  }

  constructor() {
    if (!process.env.USERMANAGER_PORT) {
      console.warn("Missing USERMANAGER_PORT env, using default port 3000");
      process.env.USERMANAGER_PORT = "3000";
    }
    this._port = parseInt(process.env.USERMANAGER_PORT);
    if (isNaN(this._port)) throw new Error("USERMANAGER_PORT must be an integer");
    if (!process.env.USERMANAGER_LOGGER) {
      if (process.env.LOGGER)
        process.env.USERMANAGER_LOGGER = process.env.LOGGER;
      else {
        console.warn("Missing USERMANAGER_LOGGER|LOGGER env, using default 'true'");
        process.env.USERMANAGER_LOGGER = "true";
      }
    }
    this._logger = process.env.USERMANAGER_LOGGER.toLowerCase() === "true";
    if (!process.env.API_KEY) {
      console.warn("Missing API_KEY env, setting a random key...");
      process.env.API_KEY = crypto.randomBytes(32).toString("hex");
      console.info(`API_KEY for Authorization header: ${process.env.API_KEY}`)	
    }
    this._api_key = process.env.API_KEY;
    if (!process.env.KEYPATH || !process.env.CERTPATH) {
      console.warn("Missing KEYPATH or CERTPATH env, using default paths.");
      this._cert = {
        _keypath: "/etc/ssl/private/sarif.key",
        _certpath: "/etc/ssl/certs/sarif.crt",
      };
    } else {
      this._cert = {
        _keypath: process.env.KEYPATH,
        _certpath: process.env.CERTPATH,
      };
    }
    console.warn(`Loading certificate and key from ${this._cert._certpath} and ${this._cert._keypath}`);
  }

  public get port(): number { return this._port; }
  public get logger(): boolean { return this._logger; }
  public get api_key(): string { return this._api_key; }
  public get cert(): { _keypath: string; _certpath: string } {
    return {
      _keypath: this._cert._keypath,
      _certpath: this._cert._certpath
    };
  }
}

class UsermanagerConfig {
  private _issuer: string;
  private _secret: string;
  private _ttl: number;

  constructor() {
    if (!process.env.USERMANAGER_JWT_ISSUER) {
      console.warn("Missing USERMANAGER_ISSUER env, using default 'sarif.usermanager'");
      process.env.USERMANAGER_JWT_ISSUER = "sarif.usermanager";
    }
    this._issuer = process.env.USERMANAGER_JWT_ISSUER;

    if (!process.env.USERMANAGER_JWT_SECRET) {
      console.warn("Missing USERMANAGER_JWT_SECRET env, using a random secret");
      process.env.USERMANAGER_JWT_SECRET = crypto.randomBytes(32).toString("hex");
      console.info(`USERMANAGER_JWT_SECRET for signing tokens: ${process.env.USERMANAGER_JWT_SECRET}`);
    }
    this._secret = process.env.USERMANAGER_JWT_SECRET;

    if (!process.env.USERMANAGER_JWT_TTL) {
      console.warn("Missing USERMANAGER_JWT_TTL env, using default 3600 seconds");
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

class ConfigManager {
  private _serverconfig: ServerConfig;
  private _oauthconfig: UsermanagerConfig;

  public get ServerConfig() : ServerConfig { return this._serverconfig; }
  public get UsermanagerConfig() : UsermanagerConfig { return this._oauthconfig; }

  constructor() {
    dotenv.config();
    this._serverconfig = new ServerConfig();
    this._oauthconfig = new UsermanagerConfig();
  }
}

export const config = new ConfigManager();