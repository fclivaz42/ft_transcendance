export interface Users {
  PlayerID: string,
  DisplayName: string,
  EmailAddress: string,
  PassHash: string,
  OAuthID: string | null,
  ActiveToken: string | null,
  SessionID: string | null,
  FriendsList: string | null,
  PhoneNumber: string | null,
  FirstName: string | null,
  FamilyName: string | null,
  Bappy: number | null,
  Admin: number | null,
};

export interface UserLoginProps {
    username: string;
    password: string;
}

export interface UserRegisterProps extends UserLoginProps {
  email: string;
}
