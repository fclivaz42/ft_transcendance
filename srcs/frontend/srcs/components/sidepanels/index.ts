import { createPongSidePanel } from "./pongSidePanel.js";
import { createTetrisSidePanel } from "./tetrisSidePanel.js";

export function createSidePanel(title: string): HTMLElement {
	const container = document.createElement("div");

	container.className = "src_panel w-64 overflow-hidden bg-white h-[80%] rounded-xl p-4";
	container.innerHTML = `
		<h3 class="text-lg text-center font-bold">${title}</h3>
        <hr class="my-4">
	`;
	return container;
}

export function createSidePanelButton(title: string, logo?: string): HTMLElement {
	const button = document.createElement("a");
	button.className = "bg-white rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-1";
	button.innerHTML = `
		${logo? `<img class="h-4 w-4" src="${logo}">`:""}
		<p>${title}</p>
	`;
	button.href="#";
	return button;
}

export function createSidePanelFromDataPanel(dataPanel: string): HTMLElement | null {
	switch (dataPanel) {
		case "pongSidePanel":
			return createPongSidePanel();
		case "tetrisSidePanel":
			return createTetrisSidePanel();
		/*case "leaderboardSidePanel":
			return createLeaderboardSidePanel();*/
		default:
			return null;
	}
}

export { createPongSidePanel } from "./pongSidePanel.js";
export { createTetrisSidePanel }  from "./tetrisSidePanel.js";
