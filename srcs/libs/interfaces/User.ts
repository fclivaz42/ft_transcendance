export interface User {
	PlayerID?: string,
	DisplayName: string,
	EmailAddress: string,
	Password: string,
	OAuthID?: string,
	FriendsList?: Array<string>,
	Private?: number,
	LastAlive?: number,
	Avatar?: string,
};

export interface UserLoginProps {
	DisplayName?: string;
	EmailAddress?: string;
	Password: string;
	ClientID: string;
}

export interface UserRegisterProps extends UserLoginProps {
	DisplayName: string;
	EmailAddress: string;
}

export interface UserLoginOauthProps {
	OAuthID: string;
}

export interface UserRegisterOauthProps extends
	Partial<UserRegisterProps>,
	UserLoginOauthProps { }
