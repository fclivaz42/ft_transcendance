import { userMenuManager } from "../managers/UserMenuManager";
import type { Users, Friends } from "../interfaces/Users";
import NotificationManager from "../managers/NotificationManager";
import { i18nHandler } from "./i18nHandler";
import FixedSizeMap from "../class/FixedSizeMap";
import { AiUsers } from "../interfaces/AiUsers";

export interface UserStats {
	wonMatches: number;
	lostMatches: number;
	totalMatches: number;
}

class UserHandler {
	private _clientId: string = "";
	private _user: Users | undefined;
	private _friendList: Friends[] = [];
	private _updatingAliveStatus: boolean = false;
	private _updatingFriendList: boolean = false;
	private _publicUserCache = new FixedSizeMap<String, Users>(32);

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

	public static maskEmail(email: string): string {
		const [user, domain] = email.split("@");
		const maskedUser = user.slice(0, 3) + "*".repeat(Math.max(1, user.length - 3));
		const [domainName, domainExt] = domain.split(".");
		const maskedDomain = "*".repeat(domainName.length) + "." + domainExt;
		return `${maskedUser}@${maskedDomain}`;
	}

	public maskEmail(email?: string): string {
		return email ? UserHandler.maskEmail(email) : UserHandler.maskEmail(this._user?.EmailAddress || "");
	}

	public async initialize() {
		await this.fetchUser();
	}

	public async updateFriendList() {
		while (this.isLogged && !this._updatingFriendList) {
			this._updatingFriendList = true;
			const friendListResp: Response | undefined = await fetch("/api/users/me/friends").catch(error => { console.error(error); return undefined; });
			if (!friendListResp || !friendListResp.ok) {
				console.warn("Failed to fetch friend list:", friendListResp?.statusText);
				this._friendList = [];
				return;
			}
			this._friendList = await friendListResp.json() as Friends[];
			for (const friend of this._friendList)
				this._friendList[this._friendList.indexOf(friend)] = await this.filterFriend(friend);
			await new Promise(resolve => setTimeout(resolve, 30000));
			this._updatingFriendList = false;
		}
	}

	public async updateAliveStatus() {
		while (this.isLogged && !this._updatingAliveStatus) {
			this._updatingAliveStatus = true;
			try {
				await fetch("/api/users/me/alive", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						PlayerId: this._clientId,
					}),
				});
			} catch (error) {
				console.error("Failed to update alive status:", error);
			}
			await new Promise(resolve => setTimeout(resolve, 25000));
			this._updatingAliveStatus = false;
		}
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
		return this._user?.Avatar || `https://placehold.co/100x100?text=${this.displayName?.substring(0, 2) || "?"}&font=roboto&bg=cccccc`;
	}

	public get isLogged() {
		return this._user !== undefined;
	}

	private deprecatedAIFetch(playerId: string) {
		console.warn("Deprecated method 'deprecatedAIFetch' is called. Use 'fetchUser' instead.");
		const identifier = playerId.split("_");
		if (identifier.length === 2 && identifier[0] === "AI") {
			if (identifier[1] === "opponent")
				return "P-0";
			console.warn("Deprecated AI user fetch for identifier:", identifier);
			const aiIndex = parseInt(identifier[1], 10);
			if (aiIndex >= 0 && aiIndex < AiUsers.size) {
				return `P-${aiIndex + 1}`;
			}
		}
		return null;
	}

	public async fetchUser(playerId?: string): Promise<Users | undefined> {
		console.log("Fetching user data for playerId:", playerId);
		if (playerId) {
			const deprecatedUser = this.deprecatedAIFetch(playerId);
			if (deprecatedUser)
				playerId = deprecatedUser;
			if (AiUsers.has(playerId)) {
				const user = AiUsers.get(playerId)!;
				user.DisplayName = i18nHandler.getValue(user.DisplayName);
				return user;
			}
			if (playerId === this.userId) {
				if (!this._user)
					return this.fetchUser();
				return this._user;
			}
			if (this._publicUserCache.has(playerId))
				return this._publicUserCache.get(playerId);
			const user = await fetch(`/api/users/${playerId}`);
			if (!user.ok) {
				console.warn("Failed to fetch user data:", user.statusText);
				return undefined;
			}
			const userData = await user.json();
			this._publicUserCache.set(playerId, userData as Users);
			setTimeout(() => {
				this._publicUserCache.delete(playerId);
			}, 60000);
			return userData as Users;
		}
		if (this._user)
			return this._user;
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
				this._user = { ...userData } as Users;
				if (!this._user)
					throw new Error("User data is undefined or null");
				this.updateAliveStatus();
				this.updateFriendList();
				const avatarFile = await fetch("/api/users/me/picture");
				if (avatarFile.ok) {
					if (avatarFile.status === 200)
						this._user.Avatar = "/api/users/me/picture";
				} else {
					console.warn("Failed to fetch user avatar:", avatarFile.statusText);
				}
			}
		}
		this.updateComponents();
		return this._user as Users;
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
				element.textContent = this.maskEmail(this.emailAddress);
			}
		});

		userMenuManager.initialize();
	}

	public async removeFriend(playerId: string): Promise<void> {
		const response = await fetch(`/api/users/me/friends/${playerId}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			NotificationManager.notify({
				level: "error",
				title: i18nHandler.getValue("notification.generic.errorTitle"),
				message: i18nHandler.getValue("user.notification.deleteError"),
			});
			throw new Error("Failed to remove friend");
		}
		this._friendList = this._friendList.filter(friend => friend.PlayerID !== playerId);
		this.updateComponents();
	}

	public get friendList() {
		return this._friendList;
	}

	public async fetchUserStats(playerId?: string): Promise<UserStats> {
		if (!playerId)
			playerId === this.userId
		const stats = await fetch(`/api/users/${playerId}/stats`);
		if (!stats.ok)
			throw new Error(`Failed to fetch user stats for playerId ${playerId}: ${stats.statusText}`);
		return await stats.json() as UserStats;
	}

	private async filterFriend(bot: Users): Promise<Friends> {
		if (AiUsers.has(bot.PlayerID)) {
			const friend = AiUsers.get(bot.PlayerID) as Friends;
			friend.DisplayName = i18nHandler.getValue(friend.DisplayName);
			friend.isAlive = true;
			return friend;
		}
		const friend = bot as Friends;
		friend.isAlive = await this.getAliveStatus(bot.PlayerID);
		return friend;
	}

	public async addFriend(PlayerID: string): Promise<Response> {
		const res = await fetch(`/api/users/me/friends`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ PlayerID }),
		});
		if (!res.ok) {
			console.error("Failed to add friend:", res.statusText);
			if (res.status === 409) {
				NotificationManager.notify({
					level: "warning",
					title: i18nHandler.getValue("notification.generic.warningTitle"),
					message: i18nHandler.getValue("user.notification.alreadyExists")
				});
				throw new Error("You are already friends with this user.");
			}
			else if (res.status === 404) {
				NotificationManager.notify({
					level: "error",
					title: i18nHandler.getValue("notification.generic.errorTitle"),
					message: i18nHandler.getValue("user.notification.notFound"),
				});
				throw new Error("User not found.");
			}
			else {
				NotificationManager.notify({
					level: "error",
					title: i18nHandler.getValue("notification.generic.errorTitle"),
					message: i18nHandler.getValue("user.notification.add.error"),
				});
				throw new Error("Failed to add friend due to an unknown error.");
			}
		}
		const friend = await this.fetchUser(PlayerID) as Friends | undefined;
		if (friend)
			this._friendList.push(await this.filterFriend(friend));
		this.updateComponents();
		return res;
	}

	public async getAliveStatus(playerId: string): Promise<boolean> {
		const response = await fetch(`/api/users/${playerId}/alive`);
		if (!response.ok) {
			console.error("Failed to fetch alive status:", response.statusText);
			return false;
		}
		const data = await response.json() as { isAlive: boolean };
		return data.isAlive || false;
	}

	public get isPrivate(): Boolean {
		if (!this._user?.Private)
			return false;
		return true;
	}
}

export default new UserHandler();
