import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";
import type { Matches } from "../../interfaces/Matches";
import UserHandler from "../../handlers/UserHandler";
import { Users } from "../../interfaces/Users";
import createUserAvatar from "../usermenu/userAvatar";
import { createButton } from "../buttons";
import NotificationManager from "../../managers/NotificationManager";
import { sanitizer } from "../../helpers/sanitizer";

async function fetchHistory(playerId?: string): Promise<Matches[]> {
	const history = await fetch(playerId ? `/api/users/${playerId}/matches` : "/api/users/me/matches");
	if (!history.ok) {
		switch (history.status) {
			case 401:
				throw new Error("errors.unauthorized");
			case 403:
				throw new Error("errors.forbidden");
			default:
				throw new Error("errors.generic");
		}
	}
	const data = await history.json();
	return data;
}

const userBuffer: Record<string, Users> = {};

async function fetchHistoryUser(playerId: string): Promise<Users> {
	if (playerId === UserHandler.userId) {
		return UserHandler.user as Users;
	}
	if (userBuffer[playerId]) {
		console.debug(`User ${playerId} found in buffer`);
		return userBuffer[playerId];
	}
	console.debug(`Fetching user ${playerId} from database`);
	let user = await UserHandler.fetchUser(playerId);
	if (!user) {
		user = {
			PlayerID: playerId,
			DisplayName: "Unknown",
			Avatar: "/assets/images/default_avatar.svg",
		};
	}
	userBuffer[playerId] = user;
	setTimeout(() => {
		delete userBuffer[playerId];
	}, 60000);
	return user;
}

async function createHistoryElement(match: Matches): Promise<HTMLDivElement | null> {
	const oponents: (Users | undefined)[] = await Promise.all([
		fetchHistoryUser(match.WPlayerID),
		fetchHistoryUser(match.LPlayerID),
	]);
	if (!oponents[0])
		oponents[0] = {
			PlayerID: match.WPlayerID,
			DisplayName: "Unknown",
		}
	if (!oponents[1]) {
		oponents[1] = {
			PlayerID: match.LPlayerID,
			DisplayName: "Unknown",
		}
	}
	const q = RoutingHandler.searchParams.get("q");
	if (q && q.length > 3) {
		if (!oponents[0].DisplayName.toLowerCase().startsWith(q?.toLowerCase() || "")
			&& !oponents[1].DisplayName.toLowerCase().startsWith(q?.toLowerCase() || "")) {
			return null;
		}
	}
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="relative cursor-pointer select-none w-fit bg-panel dark:bg-panel_dark p-4 mb-4 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center hover:animate-scale hover:animate-duration-100">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center justify-start gap-2 lg:w-[250px] w-[160px]">
					<div data-history-player="p1" class="relative">
						<p data-i18n="history.winner" class="lg:text-xl text-sm absolute -bottom-4 left-8 bg-green-600 dark:bg-green-800 rounded-md p-1 opacity-70">${i18nHandler.getValue("history.winner")}</p>
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-right-16 -right-20 absolute">${sanitizer(match.WScore)}</p>
					</div>
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${sanitizer(oponents[0].DisplayName)}</p>
				</div>
				<p class="lg:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
					VS
				</p>
				<div class="flex items-center justify-end gap-2 lg:w-[250px] w-[160px]">
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${sanitizer(oponents[1].DisplayName)}</p>
					<div data-history-player="p2" class="relative">
						<p data-i18n="history.loser" class="lg:text-xl text-sm absolute -bottom-4 right-8 bg-red-600 dark:bg-red-800 rounded-md p-1 opacity-70">${sanitizer(i18nHandler.getValue("history.loser"))}</p>
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-left-16 -left-20 absolute">${sanitizer(match.LScore)}</p>
					</div>
				</div>
			</div>
			<hr class="w-full my-2">
			${(() => {
				if (!match.HashAddress)
					return `<p class="absolute -top-4 mx-auto text-xs  bg-red-100 dark:bg-red-900 rounded-md p-2">
						! ${sanitizer(i18nHandler.getValue("history.notchain"))}
						</p>`;
				return "";
			})()}
		</div>
	`;
	const userContainers = template.content.querySelectorAll("[data-history-player]");
	for (const container of userContainers) {
		container.getAttribute("data-history-player") === "p1" ?
			container.appendChild(createUserAvatar({playerId: oponents[0].PlayerID, sizeClass: "lg:w-24 lg:h-24 w-12 h-12"})) :
			container.appendChild(createUserAvatar({playerId: oponents[1].PlayerID, sizeClass: "lg:w-24 lg:h-24 w-12 h-12"}));
	}
	const historyElement = template.content.firstElementChild as HTMLDivElement;
	historyElement.onclick = () => {
		NotificationManager.notify({
			level: "info",
			title: i18nHandler.getValue("history.notification.open.title"),
			message: i18nHandler.getValue("history.notification.open.message"),
		});
		window.open(`https://subnets-test.avax.network/c-chain/tx/${sanitizer(match.HashAddress)}`, "_blank");
	}
	return historyElement;
}

async function loadHistory(matchElements: HTMLDivElement[], page: number, elemPerPage: number): Promise<HTMLDivElement> {
	const template = document.createElement("template");
	if (matchElements.length <= 0) {
		template.innerHTML = `
			<div class="bg-panel dark:bg-panel_dark p-8 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center mb-8">
				<p class="text-center text-xl">
					${sanitizer(i18nHandler.getValue("history.empty"))}
				</p>
			</div>
		`;
		return template.content.firstElementChild as HTMLDivElement;
	}
	template.innerHTML = `
		<div>
		</div>
	`;
	const historyContainer = template.content.firstElementChild as HTMLDivElement;
	for (const element of matchElements) {
		if (matchElements.indexOf(element) >= (page - 1) * elemPerPage && matchElements.indexOf(element) < page * elemPerPage)
			historyContainer.appendChild(element);
	}
	return template.content.firstElementChild as HTMLDivElement;
}

export default async function createHistoryFrame(): Promise<HTMLDivElement> {
	const playerId = RoutingHandler.searchParams.get("playerId");
	const player = playerId ? await UserHandler.fetchUser(playerId) : UserHandler.user;
	if (!player) {
		NotificationManager.notify({
			level: "error",
			title: i18nHandler.getValue("notification.generic.errorTitle"),
			message: i18nHandler.getValue("notification.generic.errorMessage"),
		});
		RoutingHandler.setRoute("/", false);
		return document.createElement("div");
	} else if (player.Private) {
		NotificationManager.notify({
			level: "error",
			title: i18nHandler.getValue("history.notification.private.title"),
			message: i18nHandler.getValue("history.notification.private.message"),
		});
		RoutingHandler.setRoute("/", false);
		return document.createElement("div");
	}
	let page = Number(RoutingHandler.searchParams.get("p")) || 1;
	if (Number.isNaN(page) || page < 1)
		page = 1;
	const limitParam = RoutingHandler.searchParams.get("limit");
	const elemPerPage: number = Number(limitParam) || 4;
	const matches = await fetchHistory(RoutingHandler.searchParams.get("playerId") || undefined);
	const template = document.createElement("template");
	const matchElements: HTMLDivElement[] = [];
	for (const match of matches) {
		const historyElement = await createHistoryElement(match);
		if (!historyElement)
			continue;
		matchElements.push(historyElement);
	}
	template.innerHTML = `
		<div class="min-w-fit">
			${createHeaderFrame({
				title: `${i18nHandler.getValue("history.title")}`,
				i18n: "history.title",
			}).outerHTML}
			<h3 class="text-center text-2xl font-bold mb-4">
				History of ${sanitizer(player.DisplayName)}
			</h3>
			<div id="history-elements" class="mx-auto flex flex-col items-center gap-4 w-fit">
			</div>
			<div class="flex items-center justify-center gap-4 mt-4">
				${createButton({
					id: "history-back",
					logo: "/assets/ui/previous-svgrepo-com.svg",
				}).outerHTML}
				<p id="history-page" class="text-sm text-gray-500 dark:text-gray-400 select-none text-center w-10">
					${sanitizer(`${page} / ${Math.max(Math.ceil(matches.length / elemPerPage), 1)}`)}
				</p>
				${createButton({
					id: "history-next",
					logo: "/assets/ui/next-svgrepo-com.svg",
				}).outerHTML}
			</div>
		</div>
	`;

	const backButton = template.content.querySelector("#history-back") as HTMLButtonElement;
	backButton.onclick = async () => {
		if (page > 1)
			updatePage(--page, matches, matchElements, elemPerPage);
	}
	const nextButton = template.content.querySelector("#history-next") as HTMLButtonElement;
	nextButton.onclick = async () => {
		if (page < Math.ceil(matches.length / elemPerPage)) 
			updatePage(++page, matches, matchElements, elemPerPage);
	}

	const historyContainer = template.content.querySelector("#history-elements") as HTMLDivElement;
	historyContainer.append(...await loadHistory(matchElements, page, elemPerPage).then((content) => content.childNodes));

	return template.content.firstElementChild as HTMLDivElement;
}

async function updatePage(page: number, matches: Matches[], matchElements: HTMLDivElement[], elemPerPage: number) {
	RoutingHandler.searchParams.set("p", String(page));
	RoutingHandler.updateUrl();
	const historyContainer = document.querySelector("#history-elements") as HTMLDivElement;
	if (!historyContainer)
		return;
	historyContainer.innerHTML = "";
	const newMatches = await loadHistory(matchElements, page, elemPerPage);
	historyContainer.append(...newMatches.childNodes);
	const pageElement = document.querySelector("#history-page") as HTMLParagraphElement;
	pageElement.innerHTML = sanitizer(`${page} / ${Math.max(Math.ceil(matches.length / elemPerPage), 1)}`);
}
