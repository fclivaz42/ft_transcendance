import { i18nHandler } from "../../handlers/i18nHandler.js";
import { classStartingWith } from "../../utilities/selectors.js";
import { createSidePanel, createSidePanelSelector, createSidePanelTitle, createSidePanelToggleSlider } from "./index.js";

function appearanceSettings(sidePanel: HTMLElement) {
  //sidePanel.appendChild(createSidePanelTitle(i18nHandler.getValue("navbar.settings.submenu.appearance.title")));
  sidePanel.appendChild(createSidePanelTitle({
    title: i18nHandler.getValue("navbar.settings.submenu.appearance.title"),
    i18n: "navbar.settings.submenu.appearance.title"
  }));

  //const toggleDarkMode = createSidePanelToggleSlider(i18nHandler.getValue("navbar.settings.submenu.appearance.submenu.dark_mode"));
  const toggleDarkMode = createSidePanelToggleSlider({
    title: i18nHandler.getValue("navbar.settings.submenu.appearance.submenu.dark_mode"),
    i18n: "navbar.settings.submenu.appearance.submenu.dark_mode"
  });
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

  const languages = ["English", "Spanish", "French", "Portuguese", "Russian"];

  //const languageSelector = createSidePanelSelector(i18nHandler.getValue("navbar.settings.submenu.appearance.submenu.language"), languages);
  const languageSelector = createSidePanelSelector({
    title: i18nHandler.getValue("navbar.settings.submenu.appearance.submenu.language"),
    i18n: "navbar.settings.submenu.appearance.submenu.language",
    options: languages
  });
  const languageSelect = languageSelector.querySelector("select") as HTMLSelectElement;
  languageSelect.value = localStorage.getItem("language") || "English";
  languageSelect.addEventListener("change", () => {
    i18nHandler.setLanguage(languageSelect.value);
  });
  sidePanel.appendChild(languageSelector);
}

export function createSettingsSidePanel() {
  const sidePanel = createSidePanel({
    title: i18nHandler.getValue("navbar.settings.title"),
    i18n: "navbar.settings.title"
  });
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
