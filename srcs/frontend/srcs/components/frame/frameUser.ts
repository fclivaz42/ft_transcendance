import RoutingHandler from "../../handlers/RoutingHandler";

export default function createUserFrame(): HTMLDivElement {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	template.innerHTML = `
		<div>
		</div>
	`;
	const userFrame = template.content.firstElementChild as HTMLDivElement;
	return userFrame;
}
