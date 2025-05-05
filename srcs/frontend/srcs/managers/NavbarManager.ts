import { createNavbar } from "../components/navbar/index.js";
import SidePanelManager from "./SidePanelManager.js";

export default class NavbarManager {
  private _sidePanelManager: SidePanelManager;

  constructor() {
    this._sidePanelManager = new SidePanelManager();
  }

  public initialize() {
    const main = document.getElementById("main");
    const navBar = createNavbar({
      buttons: [
        {
          id: "btnPong",
          title: "Pong",
          logo: "./assets/ui/ping-pong-svgrepo-com.svg",
          panelId: "pongSidePanel"
        },
        {
          id: "btnBonusGame",
          title: "Bonus Game",
          logo: "./assets/ui/ping-pong-svgrepo-com.svg",
          panelId: "bonusGameSidePanel"
        },
        {
          id: "btnLeaderboard",
          title: "Leaderboard",
          logo: "./assets/ui/leaderboard-svgrepo-com.svg",
          panelId: "leaderboardSidePanel"
        }
      ]
    });
    main?.appendChild(navBar);
    this._sidePanelManager.initialize();
  }
}