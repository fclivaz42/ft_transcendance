import { userMenuManager } from "../managers/UserMenuManager";
import type { Users } from "../interfaces/Users";

class UserHandler {
	private _clientId: string = "";
	private _user: Users | undefined;
	private _friendList: Users[] = [];

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
		return this._user?.Avatar || `https://placehold.co/100x100?text=${this.displayName?.substring(0,2) || "?"}&font=roboto&bg=cccccc`;
	}

	public get isLogged() {
		return this._user !== undefined;
	}

	public async fetchUser(playerId?: string): Promise<Users | undefined> {
		if (playerId) {
			if (playerId === this.userId) {
				if (!this._user)
					return this.fetchUser();
				return this._user;
			}
			const user = await fetch(`/api/users/${playerId}`);
			if (!user.ok) {
				console.warn("Failed to fetch user data:", user.statusText);
				return undefined;
			}
			return await user.json() as Users;
		}
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
				if (!this._user)
					throw new Error("User data is undefined or null");
				const avatarFile = await fetch("/api/users/me/picture");
				if (avatarFile.ok) {
					if (avatarFile.status === 200)
						this._user.Avatar = "/api/users/me/picture";
				} else {
					console.warn("Failed to fetch user avatar:", avatarFile.statusText);
				}
			}
		}
		try {
			const friendListResp = await fetch("/api/users/me/friends");
			if (!friendListResp.ok) {
				console.warn("Failed to fetch friend list:", friendListResp.statusText);
				this._friendList = [];
			} else {
				this._friendList = await friendListResp.json() as Users[];
			}
		} catch (error) {
			console.error("Error fetching friend list:", error);
			this._friendList = [];
		}
		this.updateComponents();
		return this._user as Users;
	}

	public async fetchUserPicture(playerId: string, playerName?: string, playerAvatar?:string): Promise<string> {
		if (playerId === this.userId)
			return this.avatarUrl;
		if (playerAvatar)
			return playerAvatar;
		const response = await fetch(`/api/users/${playerId}/picture`);
		if (!response.ok)
			return `https://placehold.co/100x100?text=${playerName?.substring(0,2) || "?"}&font=roboto&bg=cccccc`;
		return response.url;
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

		const userEmailElements = document.querySelectorAll("[data-user='email']");
		userEmailElements.forEach(element => {
			if (element instanceof HTMLElement) {
				element.textContent = this.emailAddress || "Email Address";
			}
		});

		userMenuManager.initialize();
	}

	public async removeFriend(playerId: string): Promise<void> {
		const response = await fetch(`/api/users/me/friends/${playerId}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			console.error("Failed to remove friend:", response.statusText);
			throw new Error("Failed to remove friend");
		}
		this._friendList = this._friendList.filter(friend => friend.PlayerID !== playerId);
		this.updateComponents();
	}

	public get friendList() {
		return this._friendList;
	}
}

export default new UserHandler();
