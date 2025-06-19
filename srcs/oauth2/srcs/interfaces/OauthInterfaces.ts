export interface GoogleJwtDecoded {
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
}

export interface OauthCallbackRequest {
	code: number | undefined;
	state: string | undefined;
}

export interface OauthLoginRequest {
	client_id: string | undefined;
	state: string | undefined;
}

export interface OauthSessionRequest {
	state: string | undefined;
}

export interface OauthToken {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	id_token: string;
	jwt_decode: GoogleJwtDecoded | null;
}
