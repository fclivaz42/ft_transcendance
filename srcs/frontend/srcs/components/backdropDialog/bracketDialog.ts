import { createDialog } from ".";
import FixedSizeMap from "../../class/FixedSizeMap";
import { TournamentMatchStatus } from "../../game/types";
import { i18nHandler } from "../../handlers/i18nHandler";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { AiUsers } from "../../interfaces/AiUsers";
import { Users } from "../../interfaces/Users";
import { createButton } from "../buttons";
import createHeaderFrame from "../frame/components/frameHeader";
import createLoadingFrame from "../frame/frameLoading";
import createUserAvatar from "../usermenu/userAvatar";

function createBracketRoundComponent(round: TournamentMatchStatus): HTMLDivElement {
	const template = document.createElement("template");

	template.innerHTML = `
		<div class="mb-4 rounded-md dark:bg-panel_dark dark:text-white shadow-lg">
			<div class="flex flex-row items-center justify-between py-1 px-2 gap-x-4">
				<div data-pong-tournament-bracket="${round.p1}" class="flex items-center justify-start gap-x-2 w-48">
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p1)}" class="font-semibold truncate">Player 1</p>
				</div>
				<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p1)}" class="font-bold text-lg text-right ${round.scoreP1 < round.scoreP2 ? "text-red-500" : "text-green-500"}">2</p>
			</div>
			<div class="flex flex-row items-center justify-between py-1 px-2 gap-x-4">
				<div data-pong-tournament-bracket="${round.p2}" class="flex items-center justify-start gap-x-2 w-48">
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p2)}" class="font-semibold truncate">Player 2</p>
				</div>
				<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p2)}" class="font-bold text-lg text-right ${round.scoreP1 > round.scoreP2 ? "text-red-500" : "text-green-500"}">1</p>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;

	UserHandler.fetchUser(round.p1 || undefined).then((user) => {
		if (!user)
			throw new Error(`User not found for player ID: ${round.p1}`);
		const p1Elem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-username="${round.p1}"]`);
		const p1ScoreElem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-score="${round.p1}"]`);
		if (p1Elem)
			p1Elem.textContent = user.DisplayName || "Player 1";
		if (p1ScoreElem)
			p1ScoreElem.textContent = round.scoreP1.toString();
	});

	UserHandler.fetchUser(round.p2 || undefined).then((user) => {
		if (!user)
			throw new Error(`User not found for player ID: ${round.p2}`);
		const P2Elem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-username="${round.p2}"]`);
		const P2ScoreElem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-score="${round.p2}"]`);
		if (P2Elem)
			P2Elem.textContent = user.DisplayName || "Player 2";
		if (P2ScoreElem)
			P2ScoreElem.textContent = round.scoreP2.toString();
	});
	return output;
}

export function createBracketComponent(bracket: TournamentMatchStatus[]): HTMLDivElement {
	const template = document.createElement("template");
	console.log(bracket);

	template.innerHTML = `
		<div id="pong-tournament-bracket" class="m-2 p-4">
			<div class="mb-4 grid grid-flow-col grid-cols-3 items-center border-0 border-b-2 border-gray-200 text-center text-lg font-bold uppercase">
				<div>${sanitizer(i18nHandler.getValue("tournament.bracket.quarterFinals"))}</div>
				<div>${sanitizer(i18nHandler.getValue("tournament.bracket.semiFinals"))}</div>
				<div>${sanitizer(i18nHandler.getValue("tournament.bracket.finals"))}</div>
			</div>
			<div class="flex flex-row gap-x-4 justify-center">
				<div class="flex-grow flex flex-col items-center justify-evenly">
					${bracket.filter(round => round.round === 0).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="flex-grow flex flex-col items-center justify-evenly mx-2">
					${bracket.filter(round => round.round === 1).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="flex-grow flex flex-col items-center justify-evenly ml-2">
					${bracket.filter(round => round.round === 2).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;
	for(const player of output.querySelectorAll("[data-pong-tournament-bracket]")) {
		const playerId = player.getAttribute("data-pong-tournament-bracket");
		player.insertAdjacentElement("afterbegin", createUserAvatar({
			playerId: playerId || "",
		}));
	}
	return output;
}

export function createBracketDialog(bracket: TournamentMatchStatus[]) {
	const dialog = createDialog({
		allowClose: false,
	});
	const title = document.createElement("h2");
	title.className = "text-2xl font-semibold text-black dark:text-white mb-2";
	title.textContent = i18nHandler.getValue("tournament.bracket.title");
	title.setAttribute("i18n", "tournament.bracket.title");
	dialog.appendChild(title);
	const loadingPage = document.createElement("div");
	dialog.appendChild(loadingPage);
	dialog.appendChild(createBracketComponent(bracket));
	loadingPage.appendChild(createLoadingFrame(i18nHandler.getValue("tournament.waitingnext")));
	dialog.show();
	return dialog;
}
