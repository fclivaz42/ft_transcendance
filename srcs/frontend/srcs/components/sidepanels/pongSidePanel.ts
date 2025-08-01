import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";
import RoutingHandler from "../../handlers/RoutingHandler.js";
import { createPongJoinDialog } from "../dialog/pongJoin/index.js";
import UserHandler from "../../handlers/UserHandler.js";
import NotificationManager from "../../managers/NotificationManager.js";

function checkLoggedIn() {
	if (!UserHandler.isLogged) {
		NotificationManager.notify({
			message: i18nHandler.getValue("notification.user.notLogged"),
			level: "warning",
		});
		return false;
	}
	return true;
}

export function createPongSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.pong.title"),
		i18n: "navbar.pong.title"
	});
	sidePanel.id = "pongSidePanel";
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "grid grid-cols-2 gap-4";

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.play",
		logo: "/assets/ui/game-controller-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn()) {
				RoutingHandler.setRoute("/pong");
			}
		},
	}));

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.tournament",
		logo: "/assets/ui/cup-star-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn())
				RoutingHandler.setRoute("/pong?room=tournament");
		},
	}));

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.solo",
		logo: "/assets/ui/computer-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn())
				RoutingHandler.setRoute("/pong?room=computer");
		},
	}));

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.local",
		logo: "/assets/ui/game-controller-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn()) {
				RoutingHandler.setRoute("/pong?room=local");
			}
		},
	}));

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.join",
		logo: "/assets/ui/lock-alt-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn())
				createPongJoinDialog();
		},
	}));

	buttonContainer.appendChild(createSidePanelButton({
		i18n: "navbar.pong.submenu.create",
		logo: "/assets/ui/lock-alt-svgrepo-com.svg",
		f: () => {
			if (checkLoggedIn())
				RoutingHandler.setRoute("/pong?room=host");
		},
	}));

	sidePanel.appendChild(buttonContainer);

	return sidePanel;
}
