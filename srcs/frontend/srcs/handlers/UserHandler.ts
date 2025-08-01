import { userMenuManager } from "../managers/UserMenuManager";
import type { Users, Friends } from "../interfaces/Users";
import NotificationManager from "../managers/NotificationManager";
import { i18nHandler } from "./i18nHandler";
import FixedSizeMap from "../class/FixedSizeMap";
import RoutingHandler from "./RoutingHandler";
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
		if (!email)
			return "Email Address";
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
				if (friendListResp?.status === 401 || friendListResp?.status === 403) {
					this.clearUserData();
					this.updateComponents();
				}
				this._friendList = [];
				console.error("Failed to fetch friend list:", friendListResp?.statusText);
				return;
			}
			this._friendList = await friendListResp.json() as Friends[];
			for (const friend of this._friendList)
				this._friendList[this._friendList.indexOf(friend)] = await this.filterFriend(friend);
			this.sortFriendsList();
			await new Promise(resolve => setTimeout(resolve, 30000));
			this._updatingFriendList = false;
		}
	}

	public async updateAliveStatus() {
		while (this.isLogged && !this._updatingAliveStatus) {
			this._updatingAliveStatus = true;
			try {
				const res = await fetch("/api/users/me/alive", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						PlayerId: this._clientId,
					}),
				});
				if (!res.ok) {
					if (res.status === 401 || res.status === 403) {
						this.clearUserData();
						this.updateComponents();
					}
					throw new Error(res.statusText);
				}
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

	public async togglePrivacy() {
		if (!this.isLogged)
			throw new Error("User is not logged in.");
		const multipartFormData = new FormData();
		multipartFormData.append("Private", this.isPrivate ? "0" : "1");
		const req = await fetch("/api/users/update", {
			method: "PUT",
			body: multipartFormData,
		});
		if (!req.ok)
			throw new Error(`Failed to update user privacy: ${req.statusText}`);
		const update = await req.json() as Users;
		this._user!.Private = Number(update.Private);
		return this.isPrivate;
	}

	public async fetchUser(playerId?: string): Promise<Users | undefined> {
		if (playerId) {
			if (this._friendList.find(friend => friend.PlayerID === playerId))
				return this._friendList.find(friend => friend.PlayerID === playerId);
			if (AiUsers.has(playerId)) {
				const user = AiUsers.get(playerId)!;
				if (user.DisplayName.includes("."))
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
				this._publicUserCache.delete(playerId!);
			}, 60000);
			return userData as Users;
		}
		if (this._user)
			return this._user;
		const user = await fetch("/api/users/me")
			.then(response => {
				if (!response.ok) {
					if (response.status === 401 || response.status === 403) {
						this.clearUserData();
						this.updateComponents();
						return undefined;
					}
					throw new Error(`Failed to fetch user data: ${response.statusText}`);
				}
				return response;
			})
			.catch(error => {
				console.error(error);
				this.clearUserData();
				return undefined;
			});
		if (user) {
			const userData = await user.json();
			if (!userData || !userData.PlayerID || !userData.DisplayName || !userData.EmailAddress) {
				console.warn("User data is incomplete or missing.", userData);
				this.clearUserData();
			} else {
				this._user = { ...userData } as Users;
				if (!this._user)
					throw new Error("User data is undefined or null");
				this.updateAliveStatus();
				this.updateFriendList();
				const avatarFile = await fetch("/api/users/me/picture");
				if (avatarFile.ok) {
					this._user.Avatar = "/api/users/me/picture";
				} else {
					console.warn("Failed to fetch user avatar:", avatarFile.statusText);
				}
			}
		}
		this.updateComponents();
		return this._user;
	}

	private clearUserData() {
		this._user = undefined;
		this._friendList = [];
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
				if (!element.src)
					element.src = this.avatarUrl;
				else
					fetch(this.avatarUrl);
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
			if (friend.DisplayName.includes("."))
				friend.DisplayName = i18nHandler.getValue(friend.DisplayName);
			friend.isAlive = true;
			return friend;
		}
		const friend = bot as Friends;
		friend.isAlive = friend.LastAlive && Date.now() - friend.LastAlive < 30000 ? true : false;
		return friend;
	}

	private sortFriendsList() {
		this._friendList.sort((a, b) => { 
			if (a.isAlive !== b.isAlive) return a.isAlive ? -1 : 1;
			return a.DisplayName.toLowerCase().localeCompare(b.DisplayName.toLowerCase());
		});
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
		this.sortFriendsList();
		this.updateComponents();
		return res;
	}

	public get isPrivate(): Boolean {
		if (!this._user?.Private)
			return false;
		return true;
	}

	public async logout(): Promise<void> {
		fetch("/api/users/logout", {
			method: "GET",
		}).then(async (response) => {
			if (response.ok) {
				this.clearUserData();
				await RoutingHandler.setRoute("/", false);
				this.updateComponents();
			}
		}).catch((error) => {
			console.error("Error during logout:", error);
		});
	}
	
	public async updateUser(data: Partial<updateUserData>): Promise<Users> {
		const multipartFormdata = new FormData();
		if (Object.keys(data).length === 0)
			throw new Error("No data provided to update user.");
		if (data.Avatar)
			multipartFormdata.append("Avatar", data.Avatar);
		if (data.DisplayName)
			multipartFormdata.append("DisplayName", data.DisplayName);
		if (data.EmailAddress)
			multipartFormdata.append("EmailAddress", data.EmailAddress);
		if (data.Private)
			multipartFormdata.append("Private", data.Private ? "1" : "0");
		if (data.Password)
			multipartFormdata.append("Password", data.Password);
		const response = await fetch("/api/users/update", {
			method: "PUT",
			body: multipartFormdata,
		});
		if (!response.ok)
			throw new Error(`Failed to update user data: ${response.statusText}`);
		const updatedUser = await response.json() as Partial<Users>;
		this._user = { ...this._user, ...updatedUser } as Users;
		if (data.Avatar)
			this._user.Avatar = "/api/users/me/picture";
		this.updateComponents();
		return this._user;
	}
}

	export interface updateUserData {
		DisplayName: string;
		EmailAddress: string;
		Avatar: File;
		Private: boolean;
		Password: string;	
	}

export default new UserHandler();
