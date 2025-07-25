import { createDialog } from ".";
import FixedSizeMap from "../../class/FixedSizeMap";
import { TournamentMatchStatus } from "../../game/types";
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
			<div class="flex flex-row items-center justify-between py-2 px-4 gap-x-4">
				<div class="flex items-center justify-start gap-x-2 w-48">
					${createUserAvatar({
						playerId: round.p1,
						isComputer: round.p1.startsWith("AI_"),
					}).outerHTML}
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p1)}" class="font-semibold truncate">Player 1</p>
				</div>
				<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p1)}" class="font-bold text-lg text-right ${round.scoreP1 < round.scoreP2 ? "text-red-500" : "text-green-500"}">2</p>
			</div>
			<div class="flex flex-row items-center justify-between py-2 px-4 gap-x-4">
				<div class="flex items-center justify-start gap-x-2 w-48">
					${createUserAvatar({
						playerId: round.p2,
						isComputer: round.p2.startsWith("AI_"),
					}).outerHTML}
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p2)}" class="font-semibold truncate">Player 2</p>
				</div>
				<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p2)}" class="font-bold text-lg text-right ${round.scoreP1 > round.scoreP2 ? "text-red-500" : "text-green-500"}">1</p>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;

	UserHandler.fetchUser(round.p1).then((user) => {
		const p1Elem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-username="${round.p1}"]`);
		const p1ScoreElem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-score="${round.p1}"]`);
		if (p1Elem)
			p1Elem.textContent = user.DisplayName || "Player 1";
		if (p1ScoreElem)
			p1ScoreElem.textContent = round.scoreP1.toString();
	});

	UserHandler.fetchUser(round.p2).then((user) => {
		const P2Elem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-username="${round.p2}"]`);
		const P2ScoreElem = document.querySelector(`[data-bracket-round="${round.round.toString()}"][data-bracket-score="${round.p2}"]`);
		if (P2Elem)
			P2Elem.textContent = user.DisplayName || "Player 2";
		if (P2ScoreElem)
			P2ScoreElem.textContent = round.scoreP2.toString();
	});
	return output;
}

function createBracketComponent(bracket: TournamentMatchStatus[][]): HTMLDivElement {
	const template = document.createElement("template");

	if (bracket.length < 3)
		for (let i = bracket.length; i < 3; i++) {
			const emptyRound: TournamentMatchStatus = {
				round: i,
				matchIndex: 0,
				p1: "",
				p1UserInfo: { PlayerID: "", DisplayName: "" },
				p2: "",
				p2UserInfo: { PlayerID: "", DisplayName: "" },
				scoreP1: 0,
				scoreP2: 0,
			};

			const fakeRound: TournamentMatchStatus[] = [];
			let roundPlayers = bracket[i - 1].length / 2;

			for (let j = 0; j < roundPlayers; j++)
					fakeRound.push(emptyRound);
			bracket.push(fakeRound);
		}

	template.innerHTML = `
		<div class="m-2 p-4">
			<div class="mb-4 grid grid-flow-col grid-cols-3 items-center border-0 border-b-2 border-gray-200 text-center text-lg font-bold uppercase">
				<div>Quarterfinals</div>
				<div>Semifinals</div>
				<div>Finals</div>
			</div>
			<div class="flex flex-row gap-x-4 justify-center">
				<div class="flex-grow flex flex-col items-center justify-evenly">
					${bracket[0].map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="flex-grow flex flex-col items-center justify-evenly mx-2">
					${bracket[1].map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="flex-grow flex flex-col items-center justify-evenly ml-2">
					${bracket[2].map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;
	return output;
}

export function createBracketDialog(bracket: TournamentMatchStatus[][]) {
	const dialog = createDialog({
		allowClose: false,
	});
	const title = document.createElement("h2");
	title.className = "text-2xl font-semibold text-black dark:text-white mb-4";
	title.textContent = "tournament.bracket.title";
	title.setAttribute("i18n", "tournament.bracket.title");
	dialog.appendChild(title);
	const loadingPage = document.createElement("div");
	dialog.appendChild(loadingPage);
	dialog.appendChild(createBracketComponent(bracket));
	loadingPage.appendChild(createLoadingFrame("waiting.for.next.match"));
	return dialog;
}
