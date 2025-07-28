export interface Users {
	PlayerID: string,
	DisplayName: string,
	EmailAddress?: string,
	FriendsList?: Array<string>,
	PhoneNumber?: string,
	FirstName?: string,
	FamilyName?: string,
	Bappy?: number,
	Private?: number,
	LastAlive?: number,
	Avatar?: string,
	isBot?: boolean,
};

export interface Friends extends Users {
	isAlive?: boolean,
}
