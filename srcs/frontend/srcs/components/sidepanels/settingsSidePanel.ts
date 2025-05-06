import { classStartingWith } from "../../utilities/selectors.js";
import { createSidePanel, createSidePanelButton, createSidePanelLabel, createSidePanelTitle, createSidePanelToggleSlider } from "./index.js";

function appearanceSettings(sidePanel: HTMLElement) {
  sidePanel.appendChild(createSidePanelTitle("Appearance"));

  const toggleDarkMode = createSidePanelToggleSlider("Dark Mode");
  const checkbox = toggleDarkMode.querySelector("input[type='checkbox']") as HTMLInputElement;
  checkbox.checked = document.body.classList.contains("dark");

  checkbox.addEventListener("click", () => {
    const body = document.body;
    if (body.classList.toggle("dark"))
      localStorage.setItem("darkMode", "true");
    else
      localStorage.setItem("darkMode", "false");
  });
  sidePanel.appendChild(toggleDarkMode);
}

export function createSettingsSidePanel() {
  const sidePanel = createSidePanel("Settings")
  sidePanel.id = "settingsSidePanel";

  // resize the side panel
  sidePanel.classList.remove(classStartingWith("w-", sidePanel.classList) || "");
  sidePanel.classList.add("w-96");
  sidePanel.classList.remove(classStartingWith("h-", sidePanel.classList) || "");
  sidePanel.classList.add("h-full");
  const rounded = classStartingWith("rounded-", sidePanel.classList);
	if (rounded)
		sidePanel.classList.add("rounded-bl-none");  

  appearanceSettings(sidePanel);
  return sidePanel;
}
