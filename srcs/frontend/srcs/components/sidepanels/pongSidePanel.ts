import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";
import { startGame } from "../../game/GameLaunch.js";

export function createPongSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.pong.title"),
		i18n: "navbar.pong.title"
	});
	sidePanel.id = "pongSidePanel";
	const buttonLogo = "./assets/ui/login-door-1-svgrepo-com.svg";

	sidePanel.appendChild(createSidePanelButton({
		title: i18nHandler.getValue("navbar.pong.submenu.play"),
		i18n: "navbar.pong.submenu.play",
		logo: buttonLogo,
		f: () => startGame(`wss://${location.host}/game/remote`), // TODO: Is the parameter needed? If so, maybe add env variable
		// TODO: To add a function to a button, simply map your function to the f property of the props
	}));

	sidePanel.appendChild(createSidePanelButton({
		title: i18nHandler.getValue("navbar.pong.submenu.solo"),
		i18n: "navbar.pong.submenu.solo",
		logo: buttonLogo
	}));

	sidePanel.appendChild(createSidePanelButton({
		title: i18nHandler.getValue("navbar.pong.submenu.join"),
		i18n: "navbar.pong.submenu.join",
		logo: buttonLogo
	}));

	sidePanel.appendChild(createSidePanelButton({
		title: i18nHandler.getValue("navbar.pong.submenu.create"),
		i18n: "navbar.pong.submenu.create",
		logo: buttonLogo
	}));

	return sidePanel;
}
