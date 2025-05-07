import { i18nHandler } from "../../handlers/i18nHandler.js";
import { createSidePanel, createSidePanelButton } from "./index.js";

export function createTetrisSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.tetris.title"),
		i18n: "navbar.tetris.title"
	});
	sidePanel.id = "tetrisSidePanel";
	const buttonLogo = "./assets/ui/login-door-1-svgrepo-com.svg";

	sidePanel.appendChild(createSidePanelButton({
		title: i18nHandler.getValue("navbar.tetris.submenu.play"),
		i18n: "navbar.tetris.submenu.play",
		logo: buttonLogo
	}))

	return sidePanel;
}
