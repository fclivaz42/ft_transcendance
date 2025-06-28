import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";
import type { Matches } from "../../interfaces/Matches";
import UserHandler from "../../handlers/UserHandler";
import { Users } from "../../interfaces/Users";
import createUserAvatar from "../usermenu/userAvatar";
import { createButton } from "../buttons";
import NotificationManager from "../../managers/NotificationManager";

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

async function fetchHistoryUser(playerId: string, guestname: string | null): Promise<Users> {
	console.log(userBuffer);
	if (playerId === UserHandler.userId) {
		console.log("ICIIIIIIIII");
		return UserHandler.user as Users;
	}
	if (userBuffer[playerId]) {
		console.log("LAAAAAAAAAAA");
		console.debug(`User ${playerId} found in buffer`);
		return userBuffer[playerId];
	}
	console.debug(`Fetching user ${playerId} from database`);
	let user = await UserHandler.fetchUser(playerId);
	console.log("Fetched user:", user?.DisplayName);
	if (!user) {
		user = {
			PlayerID: playerId,
			DisplayName: guestname || "Unknown",
			Avatar: `https://placehold.co/100x100?text=${(guestname || "?").substring(0, 2)}&font=roboto&bg=cccccc`,
		};
	}
	userBuffer[playerId] = user;
	setTimeout(() => {
		delete userBuffer[playerId];
	}, 60000);
	console.log(userBuffer);
	return user;
}

async function createHistoryElement(match: Matches): Promise<HTMLDivElement | null> {
	const oponents: (Users | undefined)[] = await Promise.all([
		fetchHistoryUser(match.WPlayerID, match.WGuestName),
		fetchHistoryUser(match.LPlayerID, match.LGuestName),
	]);
	if (!oponents[0])
		oponents[0] = {
			PlayerID: match.WPlayerID,
			DisplayName: match.WGuestName || "Unknown",
		}
	if (!oponents[1]) {
		oponents[1] = {
			PlayerID: match.LPlayerID,
			DisplayName: match.LGuestName || "Unknown",
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
		<a ${match.HashAddress ? `href="https://subnets-test.avax.network/c-chain/tx/${match.HashAddress}" target="_blank"` : ""} class="relative cursor-pointer select-none w-fit bg-panel dark:bg-panel_dark p-4 mb-4 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center hover:animate-scale hover:animate-duration-100">

			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center justify-start gap-2 lg:w-[250px] w-[160px]">
					<div class="relative">
						<p data-i18n="history.winner" class="lg:text-xl text-sm absolute -bottom-4 left-8 bg-green-600 dark:bg-green-800 rounded-md p-1 opacity-70">${i18nHandler.getValue("history.winner")}</p>
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-right-16 -right-20 absolute">${match.WScore}</p>
						${createUserAvatar({src: await UserHandler.fetchUserPicture(oponents[0].PlayerID, oponents[0].DisplayName), sizeClass: "lg:w-24 lg:h-24 w-12 h-12"}).outerHTML}
					</div>
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${oponents[0].DisplayName}</p>
				</div>
				<p class="lg:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
					VS
				</p>
				<div class="flex items-center justify-end gap-2 lg:w-[250px] w-[160px]">
					<p class="truncate lg:max-w-32 max-w-24 lg:text-lg text-xs font-semibold">${oponents[1].DisplayName}</p>
					<div class="relative">
						<p data-i18n="history.loser" class="lg:text-xl text-sm absolute -bottom-4 right-8 bg-red-600 dark:bg-red-800 rounded-md p-1 opacity-70">${i18nHandler.getValue("history.loser")}</p>
						<p class="text-2xl font-bold lg:bottom-0 -bottom-4 lg:-left-16 -left-20 absolute">${match.LScore}</p>
						${createUserAvatar({src: await UserHandler.fetchUserPicture(oponents[1].PlayerID, oponents[1].DisplayName), sizeClass: "lg:w-24 lg:h-24 w-12 h-12"}).outerHTML}
					</div>
				</div>
			</div>
			<hr class="w-full my-2">
			${(() => {
				if (!match.HashAddress)
					return `<p class="absolute -top-4 mx-auto text-xs  bg-red-100 dark:bg-red-900 rounded-md p-2">
						! ${i18nHandler.getValue("history.notchain")}
						</p>`;
			})()}
		</a>
	`;
	return template.content.firstElementChild as HTMLDivElement;
}

async function loadHistory(matchElements: string[], page: number, elemPerPage: number): Promise<HTMLTemplateElement> {
	const template = document.createElement("template");
	if (matchElements.length <= 0) {
		NotificationManager.notify({
			level: "info",
			message: i18nHandler.getValue("history.empty"),
			title: i18nHandler.getValue("notification.generic.infoTitle"),
		});
		template.innerHTML = `
			<div class="bg-panel dark:bg-panel_dark p-8 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center mb-8">
				<p class="text-center text-xl">
					${i18nHandler.getValue("history.empty")}
				</p>
			</div>
		`;
		return template;	
	}
	console.dir(matchElements);
	template.innerHTML = `
		${matchElements.slice((page === 1 ? 0 : (page - 1) * elemPerPage), page * elemPerPage).join("")}
	`;
	return template;
}

export default async function createHistoryFrame(): Promise<HTMLDivElement> {
	let page = Number(RoutingHandler.searchParams.get("p")) || 1;
	if (Number.isNaN(page) || page < 1)
		page = 1;
	const limitParam = RoutingHandler.searchParams.get("limit");
	const elemPerPage: number = Number(limitParam) || 4;
	const matches = await fetchHistory(RoutingHandler.searchParams.get("playerId") || undefined);
	const template = document.createElement("template");
	const matchElements: string[] = [];
	for (const match of matches) {
		const historyElement = await createHistoryElement(match);
		if (!historyElement)
			continue;
		matchElements.push(historyElement.outerHTML);
	}
	template.innerHTML = `
		<div class="min-w-fit">
			${createHeaderFrame({
				title: i18nHandler.getValue("history.title"),
				i18n: "history.title",
			}).outerHTML}
				<div id="history-elements" class="mx-auto flex flex-col items-center gap-4 w-fit">
					${(await loadHistory(matchElements, page, elemPerPage)).innerHTML}
				</div>
				<div class="flex items-center justify-center gap-4 mt-4">
					${createButton({
						id: "history-back",
						title: "",
						logo: "/assets/ui/previous-svgrepo-com.svg",
					}).outerHTML}
					<p id="history-page" class="text-sm text-gray-500 dark:text-gray-400 select-none text-center w-10">
						${page} / ${Math.max(Math.ceil(matches.length / elemPerPage), 1)}
					</p>
					${createButton({
						id: "history-next",
						title: "",
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

	return template.content.firstElementChild as HTMLDivElement;
}

async function updatePage(page: number, matches: Matches[], matchElements: string[], elemPerPage: number): void {
	RoutingHandler.searchParams.set("p", String(page));
	RoutingHandler.updateUrl();
	const historyContainer = document.querySelector("#history-elements") as HTMLDivElement;
	if (!historyContainer)
		return;
	historyContainer.innerHTML = "";
	const newMatches = await loadHistory(matchElements, page, elemPerPage);
	historyContainer.append(...newMatches.content.childNodes);
	const pageElement = document.querySelector("#history-page") as HTMLParagraphElement;
	pageElement.innerHTML = `${page} / ${Math.max(Math.ceil(matches.length / elemPerPage), 1)}`;
}
