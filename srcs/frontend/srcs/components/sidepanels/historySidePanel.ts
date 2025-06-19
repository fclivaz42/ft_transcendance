import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";

export function createHistorySidePanel() {
  const sidePanel = createSidePanel({
    title: i18nHandler.getValue("navbar.history.title"),
    i18n: "navbar.history.title",
  });
  sidePanel.id = "historySidePanel";

  return sidePanel;
}
