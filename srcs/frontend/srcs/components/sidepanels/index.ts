import { ButtonProps, TitleProps } from "../../interfaces/baseProps.js";
import { createButton } from "../buttons/index.js";
import { createFriendSidePanel } from "./friendSidePanel.js";
import { createHistorySidePanel } from "./historySidePanel.js";
import { createPongSidePanel } from "./pongSidePanel.js";
import { createSettingsSidePanel } from "./settingsSidePanel.js";

export const defaultPanelSize = "w-64";

export function createSidePanel(props: TitleProps): HTMLElement {
	const container = document.createElement("div");

	container.className = `${defaultPanelSize} overflow-hidden bg-panel dark:bg-panel_dark h-[80%] rounded-xl p-8`;
	container.innerHTML = `
		<h3 class="text-lg text-center font-bold"${props.i18n ? " data-i18n=\"" + props.i18n + "\"" : ""}>${props.title}</h3>
        <hr class="my-4">
	`;
	return container;
}

export function createSidePanelButton(props: ButtonProps): HTMLElement {
	const button = createButton({
		...props,
		color: "bg-background",
		darkColor: "dark:bg-background_dark",
	});
	button.classList.add("my-4");
	return button;
}

export function createSidePanelTitle(props: TitleProps): HTMLElement {
	const titleElement = document.createElement("h3");
	titleElement.className = "text-lg font-bold text-gray-700 dark:text-gray-100";
	titleElement.textContent = props.title;
	if (props.i18n)
		titleElement.setAttribute("data-i18n", props.i18n);
	return titleElement;
}

export function createSidePanelLabel(props: TitleProps): HTMLElement {
	const label = document.createElement("p");
	label.className = "text-xs font-semibold text-gray-500 dark:text-gray-200";
	label.textContent = props.title;
	if (props.i18n)
		label.setAttribute("i18n", props.i18n);
	return label;
}

export function createSidePanelToggleSlider(props: TitleProps): HTMLElement {
	const slider = document.createElement("div");
	slider.className = "flex items-center justify-between w-full py-2";

	slider.innerHTML = `
		<span class="text-sm font-medium text-gray-700 dark:text-gray-100"${props.i18n ? " data-i18n=\"" + props.i18n + "\"" : ""}>${props.title}</span>
		<label class="hover:animate-scale hover:animate-duration-100 cursor-pointer relative inline-block w-11 h-6">
			<input type="checkbox" class="sr-only peer cursor-pointer">
			<div class="w-full h-full bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300"></div>
			<div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-5"></div>
		</label>
	`;

	return slider;
}

interface SidePanelSelectorProps extends TitleProps {
	options: string[];
}

export function createSidePanelSelector(props: SidePanelSelectorProps): HTMLElement {
	const selector = document.createElement("div");
	selector.className = "flex flex-col gap-2";
	selector.innerHTML = `
		<div class="flex items-center justify-between w-full gap-x-32">
			<span class="text-sm font-medium text-gray-700 dark:text-gray-100"${props.i18n ? " data-i18n=\"" + props.i18n + "\"" : ""}>${props.title}</span>
			<select class="w-full p-2 border border-gray-300 rounded-md dark:bg-background_dark dark:border-gray-600 dark:text-gray-200">
				${props.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
			</select>
		</div>
	`;

	return selector;
}

export function createSidePanelFromDataPanel(attributes: NamedNodeMap): HTMLElement | null {
	const dataPanel = attributes.getNamedItem("data-panel")?.value;
	if (!dataPanel) return null;
	switch (dataPanel) {
		case "pongSidePanel":
			return createPongSidePanel();
		case "settingsSidePanel":
			return createSettingsSidePanel();
		case "historySidePanel":
			return createHistorySidePanel();
		case "friendSidePanel":
			return createFriendSidePanel();
		default:
			return null;
	}
}

export { createPongSidePanel } from "./pongSidePanel.js";
export { createSettingsSidePanel } from "./settingsSidePanel.js";
export { createHistorySidePanel } from "./historySidePanel.js";
export { createFriendSidePanel } from "./friendSidePanel.js";
