class UserHandler {
	private User: {
		PlayerID: string;
		DisplayName: string;
		EmailAddress: string;
	} | undefined;

	constructor() {
		this.fetchUser();
	}

	public get user() {
		return this.User;
	}

	public get userId() {
		return this.User?.PlayerID;
	}

	public get displayName() {
		return this.User?.DisplayName;
	}

	public get emailAddress() {
		return this.User?.EmailAddress;
	}

	public get avatarUrl() {
		// TODO: Implement avatar URL retrieval logic
		return `https://placehold.co/100x100?text=${this.displayName?.substring(0,2) || "?"}&font=roboto&bg=cccccc`;
	}

	public async fetchUser() {
		const user = await fetch("/users/me");
		if (!user.ok) {
			console.warn("Failed to fetch user data:", user.statusText);
			this.User = undefined;
			return this.User;
		}
		const userData = await user.json();
		if (!userData || !userData.PlayerID || !userData.DisplayName || !userData.EmailAddress) {
			console.warn("User data is incomplete or missing.", userData);
			return this.User;
		}
		this.User = {
			...userData,
		}
		return this.User;
	}
}

export default new UserHandler();
