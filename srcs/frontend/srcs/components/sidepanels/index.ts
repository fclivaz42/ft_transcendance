import { createLeaderboardSidePanel } from "./leaderboardSidePanel.js";
import { createPongSidePanel } from "./pongSidePanel.js";
import { createSettingsSidePanel } from "./settingsSidePanel.js";
import { createTetrisSidePanel } from "./tetrisSidePanel.js";

export function createSidePanel(title: string): HTMLElement {
	const container = document.createElement("div");

	container.className = "w-64 overflow-hidden bg-panel dark:bg-panel_dark h-[80%] rounded-xl p-8";
	container.innerHTML = `
		<h3 class="text-lg text-center font-bold">${title}</h3>
        <hr class="my-4">
	`;
	return container;
}

export function createSidePanelButton(title: string, logo?: string): HTMLElement {
	const button = document.createElement("a");
	button.className = "bg-background dark:bg-background_dark my-4 rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-1";
	button.innerHTML = `
		${logo? `<img class="h-4 w-4 dark:invert" src="${logo}">`:""}
		<p>${title}</p>
	`;
	button.href="#";
	return button;
}

export function createSidePanelTitle(title: string): HTMLElement {
	const titleElement = document.createElement("h3");
	titleElement.className = "text-lg font-bold text-gray-700 dark:text-gray-100";
	titleElement.innerHTML = title;
	return titleElement;
}

export function createSidePanelLabel(title: string): HTMLElement {
	const label = document.createElement("p");
	label.className = "text-xs font-semibold text-gray-500 dark:text-gray-200";
	label.innerHTML = title;
	return label;
}

export function createSidePanelToggleSlider(title: string): HTMLElement {
	const slider = document.createElement("div");
	slider.className = "flex items-center justify-between w-full py-2";

	slider.innerHTML = `
		<span class="text-sm font-medium text-gray-700 dark:text-gray-100">${title}</span>
		<label class="relative inline-block w-11 h-6">
			<input type="checkbox" class="sr-only peer cursor-pointer">
			<div class="w-full h-full bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300"></div>
			<div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-5"></div>
		</label>
	`;

	return slider;
}

export function createSidePanelFromDataPanel(dataPanel: string): HTMLElement | null {
	switch (dataPanel) {
		case "pongSidePanel":
			return createPongSidePanel();
		case "tetrisSidePanel":
			return createTetrisSidePanel();
		case "leaderboardSidePanel":
			return createLeaderboardSidePanel();
		case "settingsSidePanel":
			return createSettingsSidePanel();
		default:
			return null;
	}
}

export { createPongSidePanel } from "./pongSidePanel.js";
export { createTetrisSidePanel }  from "./tetrisSidePanel.js";
export { createLeaderboardSidePanel } from "./leaderboardSidePanel.js";
export { createSettingsSidePanel } from "./settingsSidePanel.js";