import { createSidePanelFromDataPanel } from "../components/sidepanels/index.js";
import { classStartingWith } from "../utilities/selectors.js";

// return true if the panels were cleared, false if there was nothing to clear
function clearPanels(animate: boolean = true): boolean {
	const animator = document.getElementById("panel_animator");
	if (!animator || animator?.childElementCount === 0) return false;

	// clear the animator and return if no animation is needed
	if (!animate) {
		let animatorWidth: string | undefined = "";
			while (animatorWidth = classStartingWith("w-", animator.classList)) {
			animator.classList.remove(animatorWidth);
		}
		animator.classList.add("w-0");
		animator.innerHTML = "";
		animator.classList.remove("mr-4");
		return true;
	}

	// animate the animator to remove it
	let animatorWidth: string | undefined = "";
	while (animatorWidth = classStartingWith("w-", animator.classList)) {
		animator.classList.remove(animatorWidth);
	}
	animator.classList.add("w-0");
	animator.classList.remove(classStartingWith("duration-", animator.classList) || "");
	animator.classList.add("duration-100");
	animator.classList.remove("mr-4");
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
	if (panel.id === animator.children[0]?.id) return;
	animator.innerHTML = panel.outerHTML;
	let animatorWidth: string | undefined = "";
	while (animatorWidth = classStartingWith("w-", animator.classList)) {
		animator.classList.remove(animatorWidth);
	}
	animator.classList.add(classStartingWith("w-", panel.classList) || "w-64");
}

export default class SidePanelManager {
	public initialize() {
		const navBar = document.getElementById("navBar");
		if (!navBar) return;
		const buttonsParent = document.getElementById("navBarButtons");
		if (!buttonsParent) return;

		const animator = document.createElement("div");
		animator.id = "panel_animator";
		animator.className = "w-0 overflow-hidden transition-all duration-300";
		navBar.appendChild(animator);

		Array.from(buttonsParent.children).forEach((button) => {
			if (!button.id.startsWith("btn")) return;
			
			button.addEventListener("pointerenter", () => {
				Array.from(buttonsParent.children).forEach((btn) => {
					if (btn.id !== button.id)
						btn.classList.remove("bg-panel");
						btn.classList.remove("dark:bg-panel_dark");
				});
				button.classList.add("bg-panel", "dark:bg-panel_dark");
				if (document.getElementById(button.attributes.getNamedItem("data-panel")?.value || "")) return;
				const panel = createSidePanelFromDataPanel(button.attributes.getNamedItem("data-panel")?.value || "");
				if (!panel) return;

				// remove top left corner radius
				if (button.parentElement?.firstElementChild === button) {
					const rounded = classStartingWith("rounded-", panel.classList);
					if (rounded)
						panel.classList.add("rounded-tl-none");
				}

				// clear panels
				replacePanel(panel);
				if (!animator.classList.contains("mr-4"))
					animator.classList.add("mr-4");

				// sync the animation
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						let animatorWidth: string | undefined = "";
						while (animatorWidth = classStartingWith("w-", animator.classList)) {
							animator.classList.remove(animatorWidth);
						}
						animator.classList.remove("w-0");
						const widthClass = classStartingWith("w-", panel.classList);
						animator.classList.add(widthClass || "w-64");
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
						btn.classList.remove("bg-panel");
						btn.classList.remove("dark:bg-panel_dark");
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
