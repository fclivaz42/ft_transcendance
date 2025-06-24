import { createSidePanelFromDataPanel, defaultPanelSize } from "../components/sidepanels/index.js";
import { classStartingWith, removeClassContaining, removeClassStartingWith } from "../utilities/selectors.js";

const sidePanelMargin = "mr-4";

// return true if the panels were cleared, false if there was nothing to clear
function clearPanels(animate: boolean = true): boolean {
	const animator = document.getElementById("panel_animator");
	if (!animator || animator.childElementCount === 0) return false;

	// clear the animator and return if no animation is needed
	if (!animate) {
		removeClassStartingWith("w-", animator.classList);
		animator.classList.add("w-0");
		animator.innerHTML = "";
		animator.classList.remove(sidePanelMargin);
		removeClassStartingWith("duration-", animator.classList);
		animator.classList.add("duration-200");
		return true;
	}

	// animate the animator to remove it
	removeClassStartingWith("w-", animator.classList);
	animator.classList.add("w-0");
	removeClassStartingWith("duration-", animator.classList);
	animator.classList.add("duration-100");
	animator.classList.remove(sidePanelMargin);
	const lastPanel = animator.children[0];
	// remove the last panel after the animation is done
	setTimeout(() => {
		if (lastPanel == animator.children[0]) // only remove the last panel if it is still the same
			clearPanels(false);
	}, 100);
	return true;
}

function replacePanel(panel: HTMLElement) {
	const animator = document.getElementById("panel_animator");
	if (!animator) return;
	if (animator.children.length > 0 && panel.id === animator.children[0].id) return;
	animator.innerHTML = "";
	animator.appendChild(panel);
	removeClassStartingWith("w-", animator.classList);
	animator.classList.add(classStartingWith("w-", panel.classList) || defaultPanelSize);
}

export default class SidePanelManager {
	public initialize() {
		const navBar = document.getElementById("navBar");
		if (!navBar) return;
		const buttonsParent = document.getElementById("navBarButtons");
		if (!buttonsParent) return;

		const animator = document.createElement("div");
		animator.id = "panel_animator";
		animator.className = "w-0 overflow-hidden transition-all duration-200";
		navBar.appendChild(animator);

		Array.from(buttonsParent.children).forEach((button) => {
			if (!button.id.startsWith("btn")) return;
			
			button.addEventListener("pointerenter", () => {
				Array.from(buttonsParent.children).forEach((btn) => {
					if (btn.id !== button.id)
						removeClassContaining("bg-panel", btn.classList);
				});
				button.classList.add("bg-panel", "dark:bg-panel_dark");
				if (document.getElementById(button.attributes.getNamedItem("data-panel")?.value || "")) return;
				if (!button.attributes.getNamedItem("data-panel"))
					clearPanels();
				const panel = createSidePanelFromDataPanel(button.attributes);
				if (!panel) return;

				// remove top left corner radius
				if (button.parentElement?.firstElementChild === button) {
					const rounded = classStartingWith("rounded-", panel.classList);
					if (rounded)
						panel.classList.add("rounded-tl-none");
				}

				// clear panels
				replacePanel(panel);
				if (!animator.classList.contains(sidePanelMargin))
					animator.classList.add(sidePanelMargin);

				// sync the animation
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						removeClassStartingWith("w-", animator.classList);
						animator.classList.remove("w-0");
						const widthClass = classStartingWith("w-", panel.classList);
						animator.classList.add(widthClass || defaultPanelSize);
					});
				});
			});
		});

		// using timeout to prevent flickering
		let leaveTimeout: number;
		navBar.addEventListener("pointerleave", () => {
			leaveTimeout = setTimeout(() => {
			clearPanels();
				Array.from(buttonsParent.children).forEach((btn) => {
					if (btn.id.startsWith("btn"))
						removeClassContaining("bg-panel", btn.classList);
				});
			} , 100);
		});

		navBar.addEventListener("pointerenter", () => {
			if (leaveTimeout) {
				clearTimeout(leaveTimeout);
				leaveTimeout = 0;
			}
		});
	}
}
