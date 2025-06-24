import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";

export default function createLeaderboardFrame(): HTMLDivElement {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	template.innerHTML = `
		<div>
		</div>
	`;
	const leaderboardFrame = template.content.firstElementChild as HTMLDivElement;
	leaderboardFrame.appendChild(createHeaderFrame({
		title: i18nHandler.getValue("leaderboard.title"),
		i18n: "leaderboard.title",
	}));
	return leaderboardFrame;
}
