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
	if (!user) {
		if (!UserHandler.isLogged)
			throw new Error("notification.user.notLogged");
		throw new Error("notification.user.notFound");
	}
	const userStats = await UserHandler.fetchUserStats(user.PlayerID);
	template.innerHTML = `
		<div class="min-w-[500px] max-w-fit mx-auto flex flex-col gap-8 p-8 rounded-xl bg-panel dark:bg-panel_dark shadow-md">
			<div id="userstats-profile" class="flex flex-col items-center justify-center gap-4">
				<h2 ${user.PlayerID === UserHandler.userId ? "data-user=\"username\"" : ""} class="text-center text-2xl font-bold"'>${sanitizer(user.DisplayName) || "User Name"}</h2>
			</div>
			<div class="flex flex-col items-center">
				<h3 class="text-sm" data-i18n="user.matches.total">${sanitizer(i18nHandler.getValue("user.matches.total"))}</h3>
				<p data-user="matchesTotal" class="text-center text-xl font-semibold">${userStats.totalMatches}</p>
			</div>
			<div class="flex gap-8 justify-center">
				<div>
					<h3 class="text-sm" data-i18n="user.matches.won">${sanitizer(i18nHandler.getValue("user.matches.won"))}</h3>
					<p data-user="matchesWon" class="text-center text-xl font-semibold">${userStats.wonMatches}</p>
				</div>
				<div>
					<h3 class="text-sm" data-i18n="user.matches.lost">${sanitizer(i18nHandler.getValue("user.matches.lost"))}</h3>
					<p data-user="matchesLost" class="text-center text-xl font-semibold">${userStats.lostMatches}</p>
				</div>
			</div>
		</div>
	`;
	const userFrame = template.content.firstElementChild as HTMLDivElement;

	const userStatsProfile = userFrame.querySelector("#userstats-profile");
	if (userStatsProfile)
		userStatsProfile.insertAdjacentElement("afterbegin", createUserAvatar({ disableClick: true, playerId: user.PlayerID, sizeClass: "w-40 h-40 mx-auto"}));

	const viewHistoryButton = createButton({
		i18n: "user.matches.viewHistory",
		addClasses: "w-fit mx-auto",
		color: "bg-background",
		f: () => {
			if (user.PlayerID === UserHandler.userId)
				RoutingHandler.setRoute("/history");
			else
				RoutingHandler.setRoute(`/history?playerId=${user.PlayerID}`);
		}
	});
	userFrame.appendChild(viewHistoryButton);

	const addFriendButton = createButton({
		i18n: "user.friend.addFriend",
		addClasses: "w-fit mx-auto",
		color: "bg-blue-200",
		darkColor: "dark:bg-blue-600",
		logo: "/assets/ui/profile-plus-round-1343-svgrepo-com.svg",
	});

	const removeFriendButton = createButton({
		i18n: "user.friend.removeFriend",
		addClasses: "w-fit mx-auto",
		color: "bg-red-200",
		darkColor: "dark:bg-red-600",
		logo: "/assets/ui/profile-close-round-1344-svgrepo-com.svg"
	});

	removeFriendButton.onclick = async () => {
		await UserHandler.removeFriend(user.PlayerID);
		RoutingHandler.setRoute(`/user?playerId=${user.PlayerID}`, false);
	}

	addFriendButton.onclick = async () => {
		await UserHandler.addFriend(user.PlayerID);
		RoutingHandler.setRoute(`/user?playerId=${user.PlayerID}`, false);
	}

	if (user.PlayerID !== UserHandler.userId) {
		if (!UserHandler.friendList.some(friend => friend.PlayerID === user.PlayerID)) {
			userFrame.insertBefore(addFriendButton, userFrame.childNodes[2]);
		} else {

			userFrame.insertBefore(removeFriendButton, userFrame.childNodes[2]);
		}
	}
	return userFrame;
}
