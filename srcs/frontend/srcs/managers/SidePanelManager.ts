import { createSidePanelFromDataPanel } from "../components/sidepanels/index.js";

function clearPanels(animate: boolean = true): boolean {
	const panels = document.getElementsByClassName("panel_animator");
	if (panels.length === 0) return false;
	Array.from(panels).forEach((panel) => {
		// if animate is false, remove the panel immediately without animation
		if (!animate) {
			panel.remove();
			return;
		}
		// animate the panel to remove it
		panel.classList.remove("w-64");
		panel.classList.add("w-0");
		const duration = Array.from(panel.classList).find((className) =>
			className.startsWith("duration-"));
		panel.classList.remove(duration || "");
		panel.classList.add("duration-100");
		setTimeout(() => {
			panel.remove();
		}, 100);
	})
	return true;
}

export default class SidePanelManager {
	public initialize() {
		const navBar = document.getElementById("navBar");
		if (!navBar) return;
		const buttonsParent = document.getElementById("navBarButtons");
		if (!buttonsParent) return;

		Array.from(buttonsParent.children).forEach((button) => {
			const id = button.id;
			if (!id.startsWith("btn")) return;
			
			button.addEventListener("pointerenter", () => {
				if (document.getElementById(button.attributes.getNamedItem("data-panel")?.value || "")) return;
				
				const panel = createSidePanelFromDataPanel(button.attributes.getNamedItem("data-panel")?.value || "");
				if (!panel) return;

				// modify the class list to add
				const animator = document.createElement("div");
				animator.className = "panel_animator w-0 overflow-hidden transition-all duration-300 mr-4";
				animator.appendChild(panel);

				// clear panels and add new panel
				if (clearPanels(false)) {
					animator.classList.add("w-64");
					navBar.appendChild(animator);
					return;
				}

				// if no panel is present, animate the width
				navBar.appendChild(animator);

				// sync the animation
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						animator.classList.remove("w-0");
						const widthClass = Array.from(panel.classList).find((className) =>
							className.startsWith("w-"));
						animator.classList.add(widthClass || "");
					});
				});
			});
		});

		navBar.addEventListener("pointerleave", () => {
			clearPanels();
		});
	}
}
