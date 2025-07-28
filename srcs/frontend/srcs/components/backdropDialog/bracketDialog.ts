import { createDialog } from ".";
import FixedSizeMap from "../../class/FixedSizeMap";
import { TournamentMatchStatus } from "../../game/types";
import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { AiUsers } from "../../interfaces/AiUsers";
import { Users } from "../../interfaces/Users";
import { createButton, createButtonIcon } from "../buttons";
import createHeaderFrame from "../frame/components/frameHeader";
import createLoadingFrame from "../frame/frameLoading";
import createUserAvatar from "../usermenu/userAvatar";

function createBracketRoundComponent(round: TournamentMatchStatus): HTMLDivElement {
	const template = document.createElement("template");
	let isPlayerInMatch = false;
	if (round.p1 === UserHandler.userId || round.p2 === UserHandler.userId) isPlayerInMatch = true;

	template.innerHTML = `
		<div class="mb-4 rounded-md ${isPlayerInMatch ? "dark:bg-blue-500 bg-blue-100" : "dark:bg-panel_dark bg-panel"} shadow-lg">
			<div class="flex flex-row items-center justify-between py-1 px-2 gap-x-4">
				<div data-bracket="${sanitizer(round.p1) || ""}" class="flex items-center justify-start gap-x-2 w-48">
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p1) || ""}" class="font-semibold truncate ${round.scoreP1 > round.scoreP2 ? "text-green-500" : ""}">???</p>
				</div>
				${round.scoreP1 || round.scoreP2 ? `<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p1)}" class="font-bold text-lg text-right ${round.scoreP1 > round.scoreP2 ? "text-green-500" : ""}">2</p>` : ""}
			</div>
			<div class="flex flex-row items-center justify-between py-1 px-2 gap-x-4">
				<div data-bracket="${sanitizer(round.p2) || ""}" class="flex items-center justify-start gap-x-2 w-48">
					<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-username="${sanitizer(round.p2) || ""}" class="font-semibold truncate ${round.scoreP1 < round.scoreP2 ? "text-green-500" : ""}">???</p>
				</div>
				${round.scoreP1 || round.scoreP2 ? `<p data-bracket-round="${sanitizer(round.round.toString())}" data-bracket-score="${sanitizer(round.p2)}" class="font-bold text-lg text-right ${round.scoreP1 < round.scoreP2 ? "text-green-500" : ""}">1</p>` : ""}
			</div>
		</div>
	`

	const output = template.content.firstElementChild as HTMLDivElement;

	if (round.p1) {
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
	}

	console.log("hey");
	console.log(round.p2);
	if (round.p2) {
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
	}
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
	for (const player of output.querySelectorAll("[data-bracket]")) {
		const playerId = player.getAttribute("data-bracket");
		player.insertAdjacentElement("afterbegin", createUserAvatar({
			playerId: playerId || "",
		}));
	}
	return output;
}

async function createWinnerComponent(winnerId: string): Promise<HTMLDivElement> {
	if (!winnerId)
		throw new Error("Winner ID is required to create winner component.");
	const winner = await UserHandler.fetchUser(winnerId);
	if (!winner)
		throw new Error(`Winner not found for player ID: ${winnerId}`);
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center justify-center p-4">
			<h3 class="text-2xl font-bold mb-2">${sanitizer(i18nHandler.getValue("tournament.bracket.winner"))}</h3>
			<div data-tournament-winner class="flex items-center justify-center gap-x-2">
				<p class="text-xl font-semibold">${sanitizer(winner.DisplayName || "Unknown Player")}</p>
			</div>
		</div>
	`;

	const output = template.content.firstElementChild as HTMLDivElement;
	output.querySelector("[data-tournament-winner]")!.insertAdjacentElement("afterbegin", createUserAvatar({
		playerId: winner.PlayerID,
		sizeClass: "w-16 h-16",
	}));
	return output;
}

export function createBracketDialog(bracket: TournamentMatchStatus[], status: "lost" | "final" | "waitingnext" = "waitingnext") {
	const dialog = createDialog({
		allowClose: false,
	});
	const bannerContainer = document.createElement("div");
	dialog.appendChild(bannerContainer);
	dialog.appendChild(createBracketComponent(bracket));
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "flex gap-16";
	const leaveButton = createButtonIcon({
		id: "pong-gameover-leave",
		i18n: "pong.gameover.leave",
		color: "text-white bg-red-500 hover:bg-red-600",
		darkColor: "dark:bg-red-700 dark:hover:bg-red-800",
	});
	leaveButton.onclick = () => {
		dialog.close();
		RoutingHandler.setRoute("/");
	}
	buttonContainer.appendChild(leaveButton);
	dialog.appendChild(buttonContainer);
	switch (status) {
		case "waitingnext":
			bannerContainer.appendChild(createLoadingFrame(i18nHandler.getValue("tournament.waitingnext")));
			break;
		case "lost":
			bannerContainer.appendChild(createLoadingFrame(i18nHandler.getValue("tournament.lost")));
			break;
		case "final":
			const finalMatch = bracket[bracket.length - 1];
			const winnerId = finalMatch.scoreP1 > finalMatch.scoreP2 ? finalMatch.p1 : finalMatch.p2;
			createWinnerComponent(winnerId || "").then((winnerComponent) => {
				bannerContainer.appendChild(winnerComponent);
			});
			const playAgain = createButtonIcon({
				id: "pong-gameover-play-again",
				i18n: "pong.gameover.playagain",
				color: "text-white bg-blue-500 hover:bg-blue-600",
				darkColor: "dark:bg-blue-700 dark:hover:bg-blue-800",
			});
			playAgain.onclick = () => {
				dialog.close();
				RoutingHandler.setRoute("/pong?room=tournament", false);
			}
			buttonContainer.appendChild(playAgain);
			break;
	}
	dialog.show();
	return dialog;
}
