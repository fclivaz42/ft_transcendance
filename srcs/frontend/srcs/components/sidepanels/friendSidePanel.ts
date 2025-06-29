import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";
import { Users } from "../../interfaces/Users.js";
import createUserAvatar from "../usermenu/userAvatar.js";
import UserHandler from "../../handlers/UserHandler.js";
import NotificationManager from "../../managers/NotificationManager.js";
import createLoadingFrame from "../frame/frameLoading.js";
import RoutingHandler from "../../handlers/RoutingHandler.js";

function createFriendContainer() {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="py-2 flex-grow h-full w-full flex flex-col gap-2 overflow-y-auto scrollbar-thin">
		</div>
	`;
	return template.content.firstElementChild as HTMLElement;
}

async function createFriendItem(user: Users) {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="hover:animate-duration-100 hover:animate-scale cursor-pointer relative group select-none w-48 mx-auto flex gap-2 items-center justify-between p-2 bg-background dark:bg-background_dark rounded-xl">
			<button data-delfriend="${user.PlayerID}" class="absolute top-0 bottom-0 left-1 bg-panel dark:bg-panel_dark rounded-full w-8 h-8 my-auto dark:hover:text-red-400 hover:text-red-600 group-hover:opacity-100 opacity-0 transition-opacity duration-100 hover:animate-scale hover:animate-duration-100 cursor-pointer text-sm font-semibold">
				<p>✕</p>
			</button>
			<p>${user.DisplayName}</p>
			${createUserAvatar({
		src: await UserHandler.fetchUserPicture(user.PlayerID, user.Avatar),
		sizeClass: "w-8 h-8",
	}).outerHTML}
		</div>
	`
	const friendItem = template.content.firstElementChild as HTMLElement;
	friendItem.addEventListener("click", () => {
		RoutingHandler.setRoute(`/history?playerId=${user.PlayerID}`);
	});
	return friendItem;
}

function createFriendEmpty() {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center justify-center gap-4">
			<p class="text-gray-500 dark:text-gray-300 text-sm">${i18nHandler.getValue("navbar.friend.empty") || "You have no friends yet."}</p>
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
	//sidePanel.classList.add("flex", "flex-col", "gap-2", "overflow-y-auto", "p-2");
	sidePanel.classList.add("py-2", "flex", "flex-col");

	const friendContainer = createFriendContainer();

	const friendList = UserHandler.friendList;

	const containerReady = new Promise<void>(async (resolve) => {
		if (friendList.length === 0) {
			const emptyContainer = createFriendEmpty();
			friendContainer.appendChild(emptyContainer);
			resolve();
			return;
		}
		for (const friend of friendList) {
			friendContainer.appendChild(await createFriendItem(friend));
		}
		resolve();
		return;
	});

	const loading = createLoadingFrame();
	loading.classList.remove("items-center");
	loading.classList.add("items-start");
	sidePanel.appendChild(loading);

	containerReady.then(() => {
		for (const deleteButton of friendContainer.querySelectorAll("[data-delfriend]")) {
			deleteButton.addEventListener("click", async (event) => {
				const target = event.currentTarget as HTMLButtonElement;
				const playerId = target.getAttribute("data-delfriend");
				if (!playerId) return;

				UserHandler.removeFriend(playerId)
					.then(() => {
						const friendItem = target.closest(".group");
						if (friendItem)
							friendItem.remove();
					})
					.catch((error) => {
						NotificationManager.notify({
							"level": "error",
							"title": i18nHandler.getValue("notification.error.title") || "Error",
							"message": i18nHandler.getValue("notification.friend.delete.error") || "Failed to delete friend.",
						});
					});
			});
		}
		loading.remove();
		sidePanel.appendChild(friendContainer);
	});

	return sidePanel;
}
