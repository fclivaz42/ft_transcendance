import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";

export function createFriendSidePanel() {
	const sidePanel = createSidePanel({
		title: i18nHandler.getValue("navbar.friend.title"),
		i18n: "navbar.friend.title",
	});
	sidePanel.id = "friendSidePanel";

	return sidePanel;
}
