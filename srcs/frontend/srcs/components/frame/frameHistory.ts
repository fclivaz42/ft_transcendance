import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";
import type { MatchComplete } from "../../interfaces/Matches";
import UserHandler from "../../handlers/UserHandler";
import createUserAvatar from "../usermenu/userAvatar";
import { createButtonIcon } from "../buttons";
import NotificationManager from "../../managers/NotificationManager";
import { sanitizer } from "../../helpers/sanitizer";

async function fetchHistory(playerId?: string): Promise<MatchComplete[]> {
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

async function createHistoryElement(match: MatchComplete, targetId?: string | null): Promise<HTMLDivElement | null> {
	const q = RoutingHandler.searchParams.get("q");
	if (q && q.length > 3) {
		if (!match.WPlayerID.DisplayName.toLowerCase().startsWith(q?.toLowerCase() || "")
			&& !match.LPlayerID.DisplayName.toLowerCase().startsWith(q?.toLowerCase() || "")) {
			return null;
		}
	}
	if (!targetId)
		targetId = UserHandler.userId || match.WPlayerID.PlayerID || match.LPlayerID.PlayerID;
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="relative cursor-pointer select-none w-fit bg-panel dark:bg-panel_dark p-4 mb-4 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center hover:animate-scale hover:animate-duration-100">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center justify-start gap-2 lg:w-[250px] w-[160px]">
					<div class="relative" data-history-player="${match.WPlayerID.PlayerID === targetId ? "p1" : "p2"}">
						${match.WPlayerID.PlayerID === targetId ?
			`<p data-i18n="history.winner" class="lg:text-xl text-sm absolute -bottom-4 left-8 bg-green-600 dark:bg-green-800 rounded-md p-1 opacity-70">${sanitizer(i18nHandler.getValue("history.winner"))}</p>`
			: `<p data-i18n="history.loser" class="lg:text-xl text-sm absolute -bottom-4 left-8 bg-red-600 dark:bg-red-800 rounded-md p-1 opacity-70">${sanitizer(i18nHandler.getValue("history.loser"))}</p>`
		}
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-right-16 -right-20 absolute">${sanitizer(match.WPlayerID.PlayerID === targetId ? match.WScore : match.LScore)}</p>
					</div>
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${sanitizer(match.WPlayerID.PlayerID === targetId ? match.WPlayerID.DisplayName : match.LPlayerID.DisplayName)}</p>
				</div>
				<p class="lg:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
					VS
				</p>
				<div class="flex items-center justify-end gap-2 lg:w-[250px] w-[160px]">
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${sanitizer(match.WPlayerID.PlayerID !== targetId ? match.WPlayerID.DisplayName : match.LPlayerID.DisplayName)}</p>
					<div class="relative" data-history-player="${match.WPlayerID.PlayerID !== targetId ? "p1" : "p2"}">
						${match.WPlayerID.PlayerID !== targetId ?
			`<p data-i18n="history.winner" class="lg:text-xl text-sm absolute -bottom-4 right-8 bg-green-600 dark:bg-green-800 rounded-md p-1 opacity-70">${sanitizer(i18nHandler.getValue("history.winner"))}</p>`
			: `<p data-i18n="history.loser" class="lg:text-xl text-sm absolute -bottom-4 right-8 bg-red-600 dark:bg-red-800 rounded-md p-1 opacity-70">${sanitizer(i18nHandler.getValue("history.loser"))}</p>`
		}
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-left-16 -left-20 absolute">${sanitizer(match.WPlayerID.PlayerID !== targetId ? match.WScore : match.LScore)}</p>
					</div>
				</div>
			</div>
			<hr class="w-full my-2">
			${(() => {
			if (!match.HashAddress)
				return `<p class="absolute -top-3 -right-3 mx-auto text-xs bg-red-100 dark:bg-red-900 rounded-md p-2">
						${sanitizer(i18nHandler.getValue("history.notchain"))}
						</p>`;
			return "";
		})()}
		</a>
	`;
	const userContainers = template.content.querySelectorAll("[data-history-player]");
	for (const container of userContainers) {
		container.getAttribute("data-history-player") === "p1" ?
			container.appendChild(createUserAvatar({ playerId: match.WPlayerID.PlayerID, sizeClass: "lg:w-24 lg:h-24 w-12 h-12" })) :
			container.appendChild(createUserAvatar({ playerId: match.LPlayerID.PlayerID, sizeClass: "lg:w-24 lg:h-24 w-12 h-12" }));
	}
	const historyElement = template.content.firstElementChild as HTMLDivElement;
	historyElement.onclick = () => {
		if (!match.HashAddress)
			return NotificationManager.notify({
				level: "error",
				title: i18nHandler.getValue("history.notification.notchain.title"),
				message: i18nHandler.getValue("history.notification.notchain.message"),
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
	const matches = await fetchHistory(player.PlayerID || undefined) as Array<MatchComplete>;
	const template = document.createElement("template");
	const matchElements: HTMLDivElement[] = [];
	for (const match of matches) {
		const historyElement = await createHistoryElement(match, player.PlayerID);
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
				${i18nHandler.getValue("history.subtitle").replace("{user}", player.DisplayName)}
			</h3>
			<div id="history-elements" class="mx-auto flex flex-col items-center gap-4 w-fit">
			</div>
			<div class="flex items-center justify-center gap-4 mt-4">
				${createButtonIcon({
		id: "history-back",
		logo: "/assets/ui/previous-svgrepo-com.svg",
	}).outerHTML}
				<p id="history-page" class="text-sm text-gray-500 dark:text-gray-400 select-none text-center w-10">
					${sanitizer(`${page} / ${Math.max(Math.ceil(matches.length / elemPerPage), 1)}`)}
				</p>
				${createButtonIcon({
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

async function updatePage(page: number, matches: MatchComplete[], matchElements: HTMLDivElement[], elemPerPage: number) {
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
