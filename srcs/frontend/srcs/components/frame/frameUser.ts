import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { createButton } from "../buttons";
import createUserAvatar from "../usermenu/userAvatar";

export default async function createUserFrame(): Promise<HTMLDivElement> {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	const user = await UserHandler.fetchUser(searchParams.get("playerId") || UserHandler.userId);
	if (!user)
		throw new Error("notification.user.notFound");
	const userStats = await UserHandler.fetchUserStats(user.PlayerID);
	template.innerHTML = `
		<div class="w-fit mx-auto flex flex-col gap-8">
			<div class="flex flex-col items-center justify-center gap-4">
				${createUserAvatar({ src: await UserHandler.fetchUserPicture(user?.PlayerID, user?.DisplayName, user?.Avatar), sizeClass: "w-40 h-40 mx-auto"}).outerHTML}
				<h2 ${user.PlayerID === UserHandler.userId ? "data-user=\"username\"" : ""} class="text-center text-2xl font-bold"'>${sanitizer(user.DisplayName) || "User Name"}</h2>
			</div>
			<div class="flex flex-col items-center">
				<h3 data-i18n="user.matches.total">${sanitizer(i18nHandler.getValue("user.matches.total"))}</h3>
				<p data-user="matchesTotal" class="text-center text-xl font-semibold">${userStats.totalMatches}</p>
			</div>
			<div class="flex gap-8">
				<div>
					<h3 data-i18n="user.matches.won">${sanitizer(i18nHandler.getValue("user.matches.won"))}</h3>
					<p data-user="matchesWon" class="text-center text-xl font-semibold">${userStats.wonMatches}</p>
				</div>
				<div>
					<h3 data-i18n="user.matches.lost">${sanitizer(i18nHandler.getValue("user.matches.lost"))}</h3>
					<p data-user="matchesLost" class="text-center text-xl font-semibold">${userStats.lostMatches}</p>
				</div>
			</div>
		</div>
	`;
	const userFrame = template.content.firstElementChild as HTMLDivElement;
	const viewHistoryButton = createButton({
		i18n: "user.matches.viewHistory",
		title: i18nHandler.getValue("user.matches.viewHistory"),
	});
	userFrame.appendChild(viewHistoryButton);
	if (user.PlayerID !== UserHandler.userId) {
		if (!UserHandler.friendList.some(friend => friend.PlayerID === user.PlayerID)) {
			const addFriendButton = createButton({
				i18n: "user.addFriend",
				f: async () => {
				},
				title: i18nHandler.getValue("user.addFriend"),
			});
			userFrame.insertBefore(addFriendButton, userFrame.childNodes[2]);
		} else {
			const removeFriendButton = createButton({
				i18n: "user.removeFriend",
				f: async () => {
					try {
						await UserHandler.removeFriend(user.PlayerID);
						RoutingHandler.setRoute("/user");
					} catch (error) {
						console.error("Failed to remove friend:", error);
					}
				},
				title: i18nHandler.getValue("user.removeFriend"),
			});
			userFrame.insertBefore(removeFriendButton, userFrame.childNodes[2]);
		}
	}
	return userFrame;
}
