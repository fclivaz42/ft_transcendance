export interface OauthRequest {
	code: number | undefined;
}

export interface OauthToken {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	id_token: string;
}
