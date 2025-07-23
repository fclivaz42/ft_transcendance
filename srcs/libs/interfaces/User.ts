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
	ClientId: string;
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

interface d_user {
	PlayerID: string,
	DisplayName: string,
	EmailAddress: string,
	Password: string
}

interface def_users {
	Deleted: d_user,
	Guest: d_user
}

export const default_users: def_users = {
	"Guest": {
		PlayerID: "P-0",
		DisplayName: "Guest",
		EmailAddress: "Guest",
		Password: "0"
	},
	"Deleted": {
		PlayerID: "P-D",
		DisplayName: "Deleted",
		EmailAddress: "Deleted",
		Password: "0"
	}
}
