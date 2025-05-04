import { createSidePanel, createSidePanelButton } from "./index.js";

export function createPongSidePanel() {
	const sidePanel = createSidePanel("Pong Game")
	sidePanel.id = "pongSidePanel";
	const buttonLogo = "./assets/ui/login-door-1-svgrepo-com.svg";
	sidePanel.appendChild(createSidePanelButton("Play now", buttonLogo))
	sidePanel.appendChild(createSidePanelButton("Solo mode", buttonLogo))
	sidePanel.appendChild(createSidePanelButton("Join a Private Game", buttonLogo))
	sidePanel.appendChild(createSidePanelButton("Create a Private Game", buttonLogo))

	return sidePanel;
}
