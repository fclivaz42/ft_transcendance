import { createPongSidePanel, createBonusGameSidePanel } from "../components/sidepanels/index.js";

function clearPanels() {
	const panels = document.getElementsByClassName("src_panel");
	Array.from(panels).forEach((panel) => {
		panel.remove();
	})
}

export default class SidePanelManager {
	public initialize() {
		const btnPong = document.getElementById("btnPong");
		btnPong?.addEventListener("pointerenter", () => {
			const navBar = document.getElementById("navBar");
			if (!navBar) return;
			if (document.getElementById("pongSidePanel")) return;
			clearPanels();
			navBar.appendChild(createPongSidePanel());
		});

		const btnBonusGame = document.getElementById("btnBonusGame");
		btnBonusGame?.addEventListener("pointerenter", () => {
			const navBar = document.getElementById("navBar");
			if (!navBar) return;
			if (document.getElementById("bonusGameSidePanel")) return;
			clearPanels();
			navBar.appendChild(createBonusGameSidePanel());
		});

		const navBar = document.getElementById("navBar");
		navBar?.addEventListener("pointerleave", () => {
			clearPanels();
		});
	}
}
