import { createSidePanel, createSidePanelButton } from "./index.js";

import { i18nHandler } from "../../handlers/i18nHandler.js";

export function createLeaderboardSidePanel() {
  const sidePanel = createSidePanel({
    title: i18nHandler.getValue("navbar.leaderboard.title"),
    i18n: "navbar.leaderboard.title",
  });
  sidePanel.id = "leaderBoardSidePanel";

  return sidePanel;
}
