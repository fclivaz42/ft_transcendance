import { userMenuManager } from "../managers/UserMenuManager";

class UserHandler {
	private User: {
		PlayerID: string;
		DisplayName: string;
		EmailAddress: string;
	} | undefined;

	public async initialize() {
		await this.fetchUser();
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
		return `https://placehold.co/100x100?text=${this.displayName?.substring(0,2) || "?"}&font=roboto&bg=cccccc`;
	}

	public get isLogged() {
		return this.User !== undefined;
	}

	public async fetchUser() {
		const user = await fetch("/api/users/me");
		if (!user.ok) {
			console.warn("Failed to fetch user data:", user.statusText);
			this.User = undefined;
		}
		else {
			const userData = await user.json();
			if (!userData || !userData.PlayerID || !userData.DisplayName || !userData.EmailAddress) {
				console.warn("User data is incomplete or missing.", userData);
				this.User = undefined;
			} else {
				this.User = {...userData};
			}
		}
		this.updateComponents();
		return this.User;
	}

	private updateComponents() {
		const userNameElements = document.querySelectorAll("[data-user='username']");
		userNameElements.forEach(element => {
			if (element instanceof HTMLElement) {
				element.textContent = this.displayName || "User Name";
			}
		});

		const userAvatarElements = document.querySelectorAll("[data-user='avatar']");
		userAvatarElements.forEach(element => {
			if (element instanceof HTMLImageElement) {
				element.src = this.avatarUrl;
			}
		});

		userMenuManager.initialize();
	}
}

export default new UserHandler();
