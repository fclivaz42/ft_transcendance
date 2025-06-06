import type { UsersSdkUser } from "./usersSdk.ts";

export default class UsersFilter {
  static filterUserData(user: UsersSdkUser) {
    const { PassHash, OAuthID, ActiveToken, SessionID, ...filteredUser } = user;
    return filteredUser;
  }

  static filterPublicUserData(user: UsersSdkUser) {
    const filteredUser = this.filterUserData(user);

    const { Bappy, EmailAddress, FamilyName, FirstName, FriendsList, ...publicUser } = filteredUser;
    return publicUser;
  }

}