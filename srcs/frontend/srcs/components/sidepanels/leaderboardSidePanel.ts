import { createSidePanel, createSidePanelButton } from "./index.js";

export function createLeaderboardSidePanel() {
  const sidePanel = createSidePanel("Leaderboard")
  sidePanel.id = "leaderBoardSidePanel";

  return sidePanel;
}
