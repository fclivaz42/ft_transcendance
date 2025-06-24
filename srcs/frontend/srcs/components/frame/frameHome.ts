import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";

export default function createHomeFrame(): HTMLDivElement {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	template.innerHTML = `
		<div>
		</div>
	`;
	const homeFrame = template.content.firstElementChild as HTMLDivElement;
	homeFrame.appendChild(createHeaderFrame({
		title: i18nHandler.getValue("home.title"),
		i18n: "home.title",
	}));
	return homeFrame;
}
