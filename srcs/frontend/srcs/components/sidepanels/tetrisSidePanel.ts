import { createSidePanel, createSidePanelButton } from "./index.js";

export function createTetrisSidePanel() {
	const sidePanel = createSidePanel("Bonus Game")
	sidePanel.id = "bonueGameSidePanel";
	const buttonLogo = "./assets/ui/login-door-1-svgrepo-com.svg";
	sidePanel.appendChild(createSidePanelButton("Play now", buttonLogo))

	return sidePanel;
}
