import { createSidePanelFromDataPanel } from "../components/sidepanels/index.js";

function classStartingWith(str: string, classList: DOMTokenList): string | undefined {
	return Array.from(classList).find((className) => className.startsWith(str));
}

function clearPanels(animate: boolean = true): boolean {
	const animatorPanels = document.getElementsByClassName("panel_animator");
	if (animatorPanels.length === 0) return false;
	Array.from(animatorPanels).forEach((animator) => {
		// if animate is false, remove the animator immediately without animation
		if (!animate) {
			animator.remove();
			return;
		}
		// animate the animator to remove it
		const widthClass = classStartingWith("w-", animator.classList);
		if (widthClass != "w-0") {
			animator.classList.remove(widthClass || "");
			animator.classList.add("w-0");
		}
		animator.classList.remove(classStartingWith("duration-", animator.classList) || "");
		animator.classList.add("duration-100");
		setTimeout(() => {
			animator.remove();
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
					animator.classList.remove("w-0");
					animator.classList.add(classStartingWith("w-", panel.classList) || "w-64");
					navBar.appendChild(animator);
					return;
				}

				// if no panel is present, animate the width
				navBar.appendChild(animator);

				// sync the animation
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						animator.classList.remove("w-0");
						const widthClass = classStartingWith("w-", panel.classList);
						animator.classList.add(widthClass || "w-64");
					});
				});
			});
		});

		navBar.addEventListener("pointerleave", () => {
			clearPanels();
		});
	}
}
