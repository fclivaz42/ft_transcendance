import crypto from 'crypto';
import { config } from './ConfigManager.ts';
import DatabaseSDK from '../../../libs/helpers/databaseSdk.ts';
import type { FastifyRequest } from 'fastify';

interface JwtEncodedToken {
	token: string;
	header: string;
	signature: string;
	payload: string;
}

interface JwtHeader {
	alg: string;
	typ: string;
}

interface JwtPayload {
	sub: string;
	data?: any;
}

interface JwtFullPayload extends JwtPayload {
	iss: string;
	iat: number;
	exp: number;
}

class JwtToken {
	private _encodedToken: JwtEncodedToken = { header: '', payload: '', signature: '', token: '' };
	private _header: JwtHeader;
	private _payload: JwtFullPayload;
	private _secret: string;

	constructor(header: JwtHeader, payload: JwtFullPayload, secret: string) {
		if (header.alg !== 'HS256') {
			throw new Error('Unsupported algorithm. Only HS256 is supported.');
		}
		this._header = header;
		this._payload = payload;
		this._secret = secret;
		this.encode();
		this.sign();
		this._encodedToken.token = `${this._encodedToken.header}.${this._encodedToken.payload}.${this._encodedToken.signature}`;
	}

	private encode() {
		this._encodedToken.header = Buffer.from(JSON.stringify(this._header)).toString('base64url');
		this._encodedToken.payload = Buffer.from(JSON.stringify(this._payload)).toString('base64url');
	}

	private sign() {
		const hmac = crypto.createHmac('sha256', this._secret)
		this._encodedToken.signature = hmac.update(`${this._encodedToken.header}.${this._encodedToken.payload}`).digest('base64url');
	}

	get encodedToken(): JwtEncodedToken {
		return { ...this._encodedToken };
	}

	get token(): string {
		return this._encodedToken.token;
	}

	get header(): JwtHeader {
		return { ...this._header }
	}

	get payload(): JwtFullPayload {
		return { ...this._payload }
	}

	get signature(): string {
		return this._encodedToken.signature;
	}
}

export interface JwtTokenVerifyResult {
	valid: boolean;
	payload?: JwtFullPayload;
	error?: "Invalid JWT format" | "Invalid JWT signature" | "JWT token has expired" | "Invalid JWT issuer" | "User not found" | "X-JWT-Token header is missing or invalid";
}

export interface JwtManagerProps {
	secret: string;
	expire: number;
	issuer: string;
	header: JwtHeader;
}

class JwtManager {
	private readonly props: JwtManagerProps;

	constructor(props: JwtManagerProps = {
		secret: config.UsermanagerConfig.secret,
		expire: config.UsermanagerConfig.ttl,
		issuer: config.UsermanagerConfig.issuer,
		header: { alg: 'HS256', typ: 'JWT' }
	}) {
		if (!props.secret || !props.expire || !props.issuer) {
			throw new Error('Invalid JwtManager configuration.');
		}
		this.props = props;
	}

	public createJwtToken(payload: JwtPayload, header: JwtHeader = { alg: 'HS256', typ: 'JWT' }): JwtToken {
		const currentTime = Math.floor(Date.now() / 1000);
		const fullPayload: JwtFullPayload = {
			...payload,
			iss: config.UsermanagerConfig.issuer,
			iat: currentTime,
			exp: currentTime + this.props.expire
		};
		return new JwtToken(header, fullPayload, this.props.secret);
	}

	private parseJwtToken(token: string): JwtEncodedToken {
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT token format');
		}
		const encodedToken: JwtEncodedToken = {
			token: token,
			header: parts[0],
			payload: parts[1],
			signature: parts[2]
		};
		const header: JwtHeader = JSON.parse(Buffer.from(encodedToken.header, 'base64url').toString());
		if (header.alg !== 'HS256') {
			throw new Error('Unsupported JWT algorithm. Only HS256 is supported.');
		}
		const payload: JwtFullPayload = JSON.parse(Buffer.from(encodedToken.payload, 'base64url').toString());
		if (!payload.iss || !payload.sub || !payload.iat || !payload.exp) {
			throw new Error('Invalid JWT payload. Missing required fields.');
		}
		return encodedToken;
	}

	public async verifyToken(request: FastifyRequest): Promise<JwtTokenVerifyResult> {
		const xjwtToken = request.headers['x-jwt-token'];
		if (!xjwtToken || typeof xjwtToken !== 'string')
			return { valid: false, error: 'X-JWT-Token header is missing or invalid' };
		const token = xjwtToken.trim();

		let jwtToken: JwtEncodedToken;
		try {
			jwtToken = this.parseJwtToken(token);
		} catch (error) {
			return { valid: false, error: 'Invalid JWT format' };
		}
		const serverSignature = crypto.createHmac('sha256', this.props.secret);
		serverSignature.update(`${jwtToken.header}.${jwtToken.payload}`);
		if (jwtToken.signature !== serverSignature.digest('base64url'))
			return { valid: false, error: 'Invalid JWT signature' };
		const payload: JwtFullPayload = JSON.parse(Buffer.from(jwtToken.payload, 'base64url').toString());
		if (payload.exp < Date.now() / 1000) {
			return { valid: false, error: 'JWT token has expired' };
		}
		if (payload.iss !== this.props.issuer) {
			return { valid: false, error: 'Invalid JWT issuer' };
		}
		const dbSdk = new DatabaseSDK();
		try {
			await dbSdk.get_user(payload.sub, "PlayerID");
		} catch (err) {
			return { valid: false, error: 'User not found' };
		}
		return { valid: true, payload };
	}
}

export const jwt = new JwtManager();
