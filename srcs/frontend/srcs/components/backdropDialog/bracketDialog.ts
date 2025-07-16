import { createDialog } from ".";
import FixedSizeMap from "../../class/FixedSizeMap";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { Round, TournamentBracket } from "../../interfaces/Tournaments";
import { Users } from "../../interfaces/Users";
import { createButton } from "../buttons";
import createHeaderFrame from "../frame/components/frameHeader";
import createLoadingFrame from "../frame/frameLoading";
import createUserAvatar from "../usermenu/userAvatar";

export const userCache = new FixedSizeMap<string, Users>(8);

async function fetchCachedUser(userId: string): Promise<Users> {
	if (userCache.has(userId))
		return userCache.get(userId) as Users;
	let user = await UserHandler.fetchUser(userId);
	if (!user) 
		user = {
			PlayerID: userId,
			DisplayName: "Unknown",
		};
	userCache.set(userId, user);
	return userCache.get(userId) as Users;
}

function createBracketRoundComponent(round: Round): HTMLDivElement {
	const template = document.createElement("template");

	template.innerHTML = `
		<div class="mb-4 rounded-md dark:bg-panel_dark dark:text-white">
			<div class="flex flex-row items-center justify-between py-2 px-4 gap-x-4">
				<div class="flex items-center justify-start gap-x-2 w-48">
					${createUserAvatar({
						playerId: round.P1,
					}).outerHTML}
					<p data-bracket-round="${sanitizer(round.Round.toString())}" data-bracket-username="${sanitizer(round.P1)}" class="font-semibold truncate">Player 1</p>
				</div>
				<p data-bracket-round="${sanitizer(round.Round.toString())}" data-bracket-score="${sanitizer(round.P1)}" class="text-right">2</p>
			</div>
			<div class="flex flex-row items-center justify-between py-2 px-4 gap-x-4">
				<div class="flex items-center justify-start gap-x-2 w-48">
					${createUserAvatar({
						playerId: round.P2,
					}).outerHTML}
					<p data-bracket-round="${sanitizer(round.Round.toString())}" data-bracket-username="${sanitizer(round.P2)}" class="font-semibold truncate">Player 2</p>
				</div>
				<p data-bracket-round="${sanitizer(round.Round.toString())}" data-bracket-score="${sanitizer(round.P2)}" class="text-right">1</p>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;

	fetchCachedUser(round.P1).then((user) => {
		const p1Elem = document.querySelector(`[data-bracket-round="${round.Round.toString()}"][data-bracket-username="${round.P1}"]`);
		const p1ScoreElem = document.querySelector(`[data-bracket-round="${round.Round.toString()}"][data-bracket-score="${round.P1}"]`);
		if (p1Elem)
			p1Elem.textContent = user.DisplayName || "Player 1";
		if (p1ScoreElem)
			p1ScoreElem.textContent = round.P1Score.toString();
	});

	fetchCachedUser(round.P2).then((user) => {
		const P2Elem = document.querySelector(`[data-bracket-round="${round.Round.toString()}"][data-bracket-username="${round.P2}"]`);
		const P2ScoreElem = document.querySelector(`[data-bracket-round="${round.Round.toString()}"][data-bracket-score="${round.P2}"]`);
		if (P2Elem)
			P2Elem.textContent = user.DisplayName || "Player 2";
		if (P2ScoreElem)
			P2ScoreElem.textContent = round.P2Score.toString();
	});
	return output;
}

function createBracketComponent(bracket: TournamentBracket): HTMLDivElement {
	const template = document.createElement("template");

	template.innerHTML = `
		<div class="m-2 p-4">
			<div class="mb-4 grid grid-flow-col grid-cols-3 items-center border-0 border-b-2 border-gray-200 text-center text-lg font-bold uppercase">
				<div>Quarterfinals</div>
				<div>Semifinals</div>
				<div>Finals</div>
			</div>
			<div class="grid grid-flow-col grid-cols-3 items-center gap-x-2">
				<div class="grid grid-flow-row grid-rows-3">
					${bracket.Rounds.filter((round) => round.Round === 0).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="mx-2 grid h-1/2 grid-flow-row grid-rows-2">
					${bracket.Rounds.filter((round) => round.Round === 1).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
				<div class="mx-2 grid h-1/4 grid-flow-row grid-rows-1">
					${bracket.Rounds.filter((round) => round.Round === 2).map(round => createBracketRoundComponent(round).outerHTML).join("")}
				</div>
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;
	return output;
}

export function createBracketDialog(bracket: TournamentBracket) {
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
	dialog.show();
}
