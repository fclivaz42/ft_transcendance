import { userMenuManager } from "../managers/UserMenuManager";

class UserHandler {
	private _clientId: string = "";
	private _user: {
		PlayerID: string;
		DisplayName: string;
		EmailAddress: string;
	} | undefined;

	constructor() {
		let clientId = localStorage.getItem("clientId");
		if (clientId = localStorage.getItem("clientId")) {
			this._clientId = clientId;
			return;
		}
		clientId = crypto.randomUUID();
		localStorage.setItem("clientId", clientId);
		this._clientId = clientId;
	}

	public async initialize() {
		await this.fetchUser();
	}

	public get clientId() {
		return this._clientId;
	}

	public get user() {
		return this._user;
	}

	public get userId() {
		return this._user?.PlayerID;
	}

	public get displayName() {
		return this._user?.DisplayName;
	}

	public get emailAddress() {
		return this._user?.EmailAddress;
	}

	public get avatarUrl() {
		return `https://placehold.co/100x100?text=${this.displayName?.substring(0,2) || "?"}&font=roboto&bg=cccccc`;
	}

	public get isLogged() {
		return this._user !== undefined;
	}

	public async fetchUser() {
		const user = await fetch("/api/users/me");
		if (!user.ok) {
			console.warn("Failed to fetch user data:", user.statusText);
			this._user = undefined;
		}
		else {
			const userData = await user.json();
			if (!userData || !userData.PlayerID || !userData.DisplayName || !userData.EmailAddress) {
				console.warn("User data is incomplete or missing.", userData);
				this._user = undefined;
			} else {
				this._user = {...userData};
			}
		}
		this.updateComponents();
		return this._user;
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
