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
	AI1: d_user,
	AI2: d_user,
	AI3: d_user,
	AI4: d_user,
	AI5: d_user,
	AI6: d_user,
	AI7: d_user,
	AI8: d_user,
}

export const default_users: def_users = {
	"AI1": {
		PlayerID: "P-0",
		DisplayName: "bot1",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI2": {
		PlayerID: "P-1",
		DisplayName: "bot2",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI3": {
		PlayerID: "P-2",
		DisplayName: "bot3",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI4": {
		PlayerID: "P-3",
		DisplayName: "bot4",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI5": {
		PlayerID: "P-4",
		DisplayName: "bot5",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI6": {
		PlayerID: "P-5",
		DisplayName: "bot6",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI7": {
		PlayerID: "P-6",
		DisplayName: "bot7",
		EmailAddress: "Guest",
		Password: "0"
	},
	"AI8": {
		PlayerID: "P-7",
		DisplayName: "bot8",
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
