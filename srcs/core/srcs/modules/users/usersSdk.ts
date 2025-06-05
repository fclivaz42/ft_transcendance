import axios from "axios";
import type { AxiosResponse } from "axios";
import https from "https";

export interface UsersSdkConfig {
  apiKey: string;
  serverUrl: string;
}

export interface UsersSdkAuthorizeResponse {
  /**
   * User ID
   */
  sub: string;
  /**
   * Additional data about the user, if any.
   */
  data?: any;
  /**
   * The issuer of the token, typically the server URL.
   */
  iss: string;
  /**
   * Issued at time.
   */
  iat: number;
  /**
   * Expiration time.
   */
  exp: number;
}

export interface UsersSdkLoginResponse {
  /**
   * JWT token for the browser to store.
   */
  token: string;
}

export interface UsersSdkLoginProps {
  /**
   * Username of the user.
   */
  username: string;
  /**
   * Password of the user.
   */
  password: string;
}

export interface UsersSdkRegisterProps extends UsersSdkLoginProps {
  /**
   * Email address of the user.
   */
  email: string;
  /**
   * Displayname of the user.
   */
  displayname: string;
}

export interface UsersSdkOptions {
  /**
   * Parameters to pass to the API endpoint.
   */
  params?: URLSearchParams;
  /**
   * Headers to pass to the API endpoint.
   */
  headers?: Record<string, string>;
  /**
   * Payload to send in the request body.
   */
  data?: any;
}

export const defaultConfig: UsersSdkConfig = {
  apiKey: process.env.API_KEY || "",
  serverUrl: "https://sarif_usermanager:3000",
}

class UsersSdk {
  private _config: UsersSdkConfig;

  constructor(config?: UsersSdkConfig) {
    this._config = config || defaultConfig;
  }

  /**
   * 
   * @param method method to use
   * @param endpoint api endpoint to call
   * @param params optional parameters to pass to the endpoint
   * @returns a promise reponse from axios for template type T
   * @example apiRequest<UsersSdkLoginResponse>("get", "login")
   */
  private async apiRequest<T>(method: "get" | "post" | "put" | "delete", endpoint: string, options?: UsersSdkOptions): Promise<AxiosResponse<T>> {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const url = `${this._config.serverUrl}/users/${endpoint}`/*${options.params ? `?${options.params.toString()}` : ""}`*/;
    return axios({
      httpsAgent,
      method,
      url,
      headers: {
        Authorization: this._config.apiKey,
        ...options?.headers,
      },
      data: options?.data,
      params: options?.params,
      validateStatus: (status => (status >= 200 && status < 300) || status === 401 || status === 403),
    });
  }

  /**
   * Authorizes a user by their token.
   * @param token JWT token to authorize.
   * @returns a promise with the authorization response from axios
   */
  public async getAuthorize(token: string): Promise<AxiosResponse<UsersSdkAuthorizeResponse>> {
    return this.apiRequest<UsersSdkAuthorizeResponse>("get", "authorize", {
      headers: {
        "X-JWT-Token": token
      }
    });
  }

  // TODO: Create an interface for the response to replace `any`
  /**
   * Get current user information.
   * @param uuid User uuid to retrieve information for.
   * @returns a promise with the user information response from axios
   */
  public async getUser(uuid: string): Promise<AxiosResponse<any>> {
    return this.apiRequest<any>("get", uuid);
  }

  /**
   * Logs in a user with their username and password.
   * @param credentials User credentials containing username and password.
   * @returns a promise with the login response from axios
   */
  public async postLogin(credentials: UsersSdkLoginProps): Promise<AxiosResponse<UsersSdkLoginResponse>> {
    return this.apiRequest<UsersSdkLoginResponse>("post", "login", {
      data: credentials,
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  /**
   * Register a new user.
   * @param registerProps User register informations.
   * @returns a promise with the login response from axios
   */
  public async postRegister(registerProps: UsersSdkRegisterProps): Promise<AxiosResponse<UsersSdkLoginResponse>> {
    return this.apiRequest<UsersSdkLoginResponse>("post", "register", {
      data: registerProps,
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  /**
   * Deletes a user.
   */
  public async deleteUser(uuid: string): Promise<AxiosResponse> {
    return this.apiRequest<void>("delete", uuid, {
      headers: {
        "X-JWT-Token": this._config.apiKey,
      },
    });
  }
}

export default UsersSdk;