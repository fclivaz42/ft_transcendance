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
          id: "btnTetris",
          title: "Tetris",
          logo: "./assets/ui/tetris-svgrepo-com.svg",
          panelId: "tetrisSidePanel"
        },
        {
          id: "btnLeaderboard",
          title: "Leaderboard",
          logo: "./assets/ui/leaderboard-svgrepo-com.svg",
          panelId: "leaderboardSidePanel"
        },
        {
          id: "btnHistory",
          title: "History",
          logo: "./assets/ui/history-svgrepo-com.svg",
          panelId: "historySidePanel"
        },
        {
          id: "btnSettings",
          title: "Settings",
          logo: "./assets/ui/settings-svgrepo-com.svg",
          panelId: "settingsSidePanel",
          bottom: true,
          animation: "group-hover:animate-rotate-180 group-hover:animate-duration-[500ms]"
        }
      ]
    });
    main?.appendChild(navBar);
    this._sidePanelManager.initialize();
  }
}