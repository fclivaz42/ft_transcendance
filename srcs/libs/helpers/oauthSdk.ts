import axios from "axios";
import type { AxiosResponse } from "axios";
import https from "https";
import type { UsersSdkToken  } from "./usersSdk.ts";

export interface Oauth2sdkConfig {
  apiKey: string;
  serverUrl: string;
}

export interface Oauth2sdkDbEntry {
  SubjectID: string,
  IssuerName: string,
  EmailAddress: string,
  FullName: string,
  FirstName: string,
  FamilyName: string,
  TokenHash: string,
  IssueTime: number,
  ExpirationTime: number,
}

export interface Oauth2sdkLoginResponse {
  url: string;
  state: string;
}

export interface Oauth2sdkCallbackResponse extends UsersSdkToken  {}

export interface Oauth2sdkSessionResponse {
  state: string;
  client_id: string;
  logged: boolean;
  token: {
    access_token: string;
    expires_in: number;
    scpope: string;
    token_type: string;
    id_token: string;
    jwt_decode: {
      issuer: string;
      authorized_party: string;
      audience: string;
      subject: string;
      email: string;
      email_verified: boolean;
      accesstoken_hash: string;
      name: string;
      picture: string;
      given_name: string;
      family_name: string;
      issued_at: number;
      expiration: number;
    };
  };
}

export const defaultConfig: Oauth2sdkConfig = {
  apiKey: process.env.API_KEY || "",
  serverUrl: "https://sarif_oauth2:3000",
}

class Oauth2sdk {
  private _config: Oauth2sdkConfig;

  constructor(config? : Oauth2sdkConfig) {
    this._config = config || defaultConfig;
  }

  /**
   * 
   * @param method method to use
   * @param endpoint api endpoint to call
   * @param params optional parameters to pass to the endpoint
   * @returns a promise reponse from axios for template type T
   * @example apiRequest<Oauth2sdkLoginResponse>("get", "login")
   */
  private async apiRequest<T>(method: "get" | "post", endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const url = `${this._config.serverUrl}/oauth/${endpoint}${params ? `?${params.toString()}` : ""}`;
    return axios({
      httpsAgent,
      method,
      url,
      headers: {
        Authorization: `Bearer ${this._config.apiKey}`,
      },
    });
  }

  /**
   * 
   * @param client_id the user's client ID to get the login URL
   * @returns a promise of type `Oauth2sdkLoginResponse` containing the login URL and state
   */
  public async getLogin(client_id: string): Promise<AxiosResponse<Oauth2sdkLoginResponse>> {
    return this.apiRequest<Oauth2sdkLoginResponse>(
      "get",
      "login",
      new URLSearchParams({ client_id })
    );
  }

  /**
   * 
   * @param code the authorization code received from the callback URL
   * @param state the state parameter to verify the callback from the callback URL
   * @returns a promise of type `Oauth2sdkCallbackResponse` containing the session information
   */
  public async getCallback(code: string, state: string): Promise<AxiosResponse<Oauth2sdkCallbackResponse>> {
    return this.apiRequest<Oauth2sdkCallbackResponse>(
      "get",
      "callback",
      new URLSearchParams({ code, state })
    );
  }

  /**
   * 
   * @param state the state parameter to get the session information
   * @returns a promise of type `Oauth2sdkSessionResponse` containing the session information
   */
  public async getSession(state: string): Promise<AxiosResponse<Oauth2sdkSessionResponse>> {
    return this.apiRequest<Oauth2sdkSessionResponse>(
      "get",
      `session/${state}`
    );
  }
}

export default Oauth2sdk;
