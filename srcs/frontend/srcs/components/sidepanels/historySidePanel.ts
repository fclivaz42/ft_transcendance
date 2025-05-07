import { createSidePanel, createSidePanelButton } from "./index.js";

export function createHistorySidePanel() {
  const sidePanel = createSidePanel("History")
  sidePanel.id = "historySidePanel";

  return sidePanel;
}
