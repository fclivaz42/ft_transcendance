import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";

export default function createHistoryFrame(): HTMLDivElement {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	template.innerHTML = `
		<div>
		</div>
	`;
	const historyFrame = template.content.firstElementChild as HTMLDivElement;
	historyFrame.appendChild(createHeaderFrame({
		title: i18nHandler.getValue("history.title"),
		i18n: "history.title",
	}));
	return historyFrame;
}
