import axios from "axios";
import type { AxiosResponse } from "axios";

export interface Oauth2sdkConfig {
  apiKey: string;
  serverUrl: string;
}

export interface Oauth2sdkLoginResponse {
  url: string;
  state: string;
}

export interface Oauth2sdkCallbackResponse {
  state: string;
  clientid: string;
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

export function defaultConfig(): Oauth2sdkConfig {
  return {
    apiKey: process.env.API_KEY || '',
    serverUrl: "http://sarif_oauth2:3000",
  };
}

class Oauth2sdk {
  private _config: Oauth2sdkConfig;

  constructor(config? : Oauth2sdkConfig) {
    this._config = config || defaultConfig();
  }

  private async apiRequest<T>(method: 'get' | 'post', endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    const url = `${this._config.serverUrl}/oauth/${endpoint}${params ? `?${params.toString()}` : ''}`;
    return axios({
      method,
      url,
      headers: {
        Authorization: this._config.apiKey,
      },
    });
  }

  public async getLogin(clientid: string): Promise<AxiosResponse<Oauth2sdkLoginResponse>> {
    const params = new URLSearchParams({ clientid });

    return this.apiRequest<Oauth2sdkLoginResponse>('get', 'login', params);
  }

  public async getCallback(code: string, state: string): Promise<AxiosResponse<Oauth2sdkCallbackResponse>> {
    const params = new URLSearchParams({ code, state });

    return this.apiRequest<Oauth2sdkCallbackResponse>('get', 'callback', params);
  }

  public async getSession(state: string): Promise<AxiosResponse<Oauth2sdkCallbackResponse>> {
    return this.apiRequest<Oauth2sdkCallbackResponse>('get', `session/${state}`);
  }
}

export default Oauth2sdk;