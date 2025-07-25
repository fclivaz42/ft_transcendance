import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";
import RoutingHandler from "../../handlers/RoutingHandler.js";
import { createPongJoinDialog } from "../dialog/pongJoin/index.js";

export function createPongSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.pong.title"),
		i18n: "navbar.pong.title"
	});
	sidePanel.id = "pongSidePanel";
	const buttonLogo = "/assets/ui/login-door-1-svgrepo-com.svg";

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.play",
		logo: buttonLogo,
		f: () => RoutingHandler.setRoute("/pong"),
	}));

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.tournament",
		logo: buttonLogo,
		f: () => RoutingHandler.setRoute("/pong?room=tournament"),
	}));

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.solo",
		logo: buttonLogo,
		f: () => RoutingHandler.setRoute("/pong?room=computer"),
	}));

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.join",
		logo: buttonLogo,
		f: () => createPongJoinDialog(),
	}));

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.create",
		logo: buttonLogo,
		f: () => RoutingHandler.setRoute("/pong?room=host"),
	}));

	sidePanel.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.local",
		logo: buttonLogo,
		f: () => RoutingHandler.setRoute("/pong?room=local"),
	}));

	return sidePanel;
}
