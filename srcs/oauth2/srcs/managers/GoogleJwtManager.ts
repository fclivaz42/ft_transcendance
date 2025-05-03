import type { GoogleJwtDecoded } from "../interfaces/OauthInterfaces";

function decodeJwt(token: string): any {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("Invalid JWT syntax");
	}

	const payload = parts[1];

	// Add padding for base64 decoding if needed
	const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");

	const decodedJson = atob(padded); // Decode base64
	return JSON.parse(decodedJson);	 // Parse JSON
}

export class GoogleJwtManager {
	private _jwtDecoded: GoogleJwtDecoded;

	constructor(jwt: string) {
		const jwtRaw = decodeJwt(jwt);
		this._jwtDecoded = {
			issuer: jwtRaw.iss,
			authorized_party: jwtRaw.azp,
			audience: jwtRaw.aud,
			subject: jwtRaw.sub,
			email: jwtRaw.email,
			email_verified: jwtRaw.email_verified,
			accesstoken_hash: jwtRaw.at_hash,
			name: jwtRaw.name,
			picture: jwtRaw.picture,
			given_name: jwtRaw.given_name,
			family_name: jwtRaw.family_name,
			issued_at: jwtRaw.iat,
			expiration: jwtRaw.exp
		};
	}

	public get jwtDecoded(): GoogleJwtDecoded { return this._jwtDecoded; }
}
