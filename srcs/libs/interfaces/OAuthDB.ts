export interface OAuthDB {
	SubjectID: string,
	IssuerName: string,
	EmailAddress: string,
	FullName?: string,
	FirstName?: string,
	FamilyName?: string,
	TokenHash: string,
	IssueTIme: number,
	ExpirationTime?: number,
}
