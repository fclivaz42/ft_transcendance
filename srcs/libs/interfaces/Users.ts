export interface Users {
	PlayerID?: string,
	DisplayName: string,
	EmailAddress: string,
	Password: string,
	OAuthID?: string,
	FriendsList?: string,
	PhoneNumber?: string,
	FirstName?: string,
	FamilyName?: string,
	Bappy?: number,
};

export interface UserLoginProps {
	DisplayName?: string;
	EmailAddress?: string;
	Password: string;
}

export interface UserRegisterProps extends UserLoginProps {
	DisplayName: string;
	EmailAddress: string;
	Password: string;
}
