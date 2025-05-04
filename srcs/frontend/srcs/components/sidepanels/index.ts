export function createSidePanel(title: string): HTMLElement {
	const container = document.createElement("div");

	container.className = "src_panel bg-white w-64 h-[80%] rounded-xl p-4";
	container.innerHTML = `
		<h3 class="text-lg text-center font-bold">${title}</h3>
        <hr class="my-4">
	`;

	container.classList.add("animate-fade-right");
	container.classList.add("animate-duration-300")
	return container;
}

export function createSidePanelButton(title: string, logo?: string): HTMLElement {
	const button = document.createElement("a");
	button.className = "bg- bg-white rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-1";
	button.innerHTML = `
		${logo? `<img class="h-4 w-4" src="${logo}">`:""}
		<p>${title}</p>
	`;
	button.href="#";
	return button;
}

export { createPongSidePanel } from "./pongSidePanel.js";
export { createBonusGameSidePanel }  from "./bonusGameSidePanel.js";
