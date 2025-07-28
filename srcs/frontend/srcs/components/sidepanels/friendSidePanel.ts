import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";
import { Friends } from "../../interfaces/Users.js";
import createUserAvatar from "../usermenu/userAvatar.js";
import UserHandler from "../../handlers/UserHandler.js";
import NotificationManager from "../../managers/NotificationManager.js";
import createLoadingFrame from "../frame/frameLoading.js";
import RoutingHandler from "../../handlers/RoutingHandler.js";
import { sanitizer } from "../../helpers/sanitizer.js";
import { classStartingWith } from "../../utilities/selectors.js";

function createFriendContainer() {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="py-2 flex-grow h-full w-full flex flex-col gap-2 overflow-y-auto scrollbar-none">
		</div>
	`;
	return template.content.firstElementChild as HTMLElement;
}

function createFriendItem(user: Friends) {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="hover:animate-duration-100 hover:animate-scale cursor-pointer relative group select-none w-64 mx-auto flex items-center justify-between p-2 bg-background dark:bg-background_dark rounded-xl">
			<p class="truncate max-w-42 left-12 absolute">${sanitizer(user.DisplayName)}</p>
			<div class="absolute -right-1 -top-1 h-4 w-4 rounded-full ${user.isAlive ? "bg-green-500" : "bg-gray-400"}"></div>
		</div>
	`
	const friendItem = template.content.firstElementChild as HTMLElement;
	friendItem.insertAdjacentElement("afterbegin", createUserAvatar({
		playerId: user.PlayerID,
		sizeClass: "w-8 h-8",
	}));
	friendItem.addEventListener("click", () => {
		RoutingHandler.setRoute(`/user?playerId=${user.PlayerID}`);
	});
	return friendItem;
}

function createFriendEmpty() {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center justify-center gap-4">
			<p class="text-gray-500 dark:text-gray-300 text-sm">${sanitizer(i18nHandler.getValue("navbar.friend.empty"))}</p>
		</div>
	`;
	return template.content.firstElementChild as HTMLElement;
}

export function createFriendSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.friend.title"),
		i18n: "navbar.friend.title",
	});
	sidePanel.id = "friendSidePanel";
	sidePanel.classList.remove(classStartingWith("w-", sidePanel.classList) || "");
	sidePanel.classList.add("flex", "flex-col", "w-[360px]");

	const friendContainer = createFriendContainer();

	const friendList = UserHandler.friendList;

	const containerReady = new Promise<void>(async (resolve) => {
		if (!friendList.length) {
			const emptyContainer = createFriendEmpty();
			friendContainer.appendChild(emptyContainer);
			resolve();
			return;
		}
		for (const friend of friendList) {
			friendContainer.appendChild(createFriendItem(friend));
		}
		resolve();
		return;
	});

	const loading = createLoadingFrame();
	loading.classList.remove("items-center");
	loading.classList.add("items-start");
	sidePanel.appendChild(loading);

	containerReady.then(() => {
		loading.remove();
		sidePanel.appendChild(friendContainer);
	});

	return sidePanel;
}
