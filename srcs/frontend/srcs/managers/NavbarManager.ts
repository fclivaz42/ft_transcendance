//barre laterale gauche [pong, history, leaderboard, settings]
import { createNavbar } from "../components/navbar/index.js";
import { i18nHandler } from "../handlers/i18nHandler.js";
import { mainManager } from "./MainManager.js";
import SidePanelManager from "./SidePanelManager.js";

class NavbarManager {
	private _navbar = createNavbar({
		buttons: []
	});
  private _sidePanelManager: SidePanelManager;

  constructor() {
    this._sidePanelManager = new SidePanelManager();
  }

  public initialize() {
		this._navbar = createNavbar({
			buttons: [
				{
					id: "btnPong",
					title: i18nHandler.getValue("navbar.pong.label"),
					logo: "./assets/ui/ping-pong-svgrepo-com.svg",
					panelId: "pongSidePanel",
					i18n: "navbar.pong.label",
				},
				{
					id: "btnLeaderboard",
					title: i18nHandler.getValue("navbar.leaderboard.label"),
					logo: "./assets/ui/leaderboard-svgrepo-com.svg",
					panelId: "leaderboardSidePanel",
					i18n: "navbar.leaderboard.label"
				},
				{
					id: "btnHistory",
					title: i18nHandler.getValue("navbar.history.label"),
					logo: "./assets/ui/history-svgrepo-com.svg",
					panelId: "historySidePanel",
					i18n: "navbar.history.label"
				},
				{
					id: "btnSettings",
					title: i18nHandler.getValue("navbar.settings.label"),
					logo: "./assets/ui/settings-svgrepo-com.svg",
					panelId: "settingsSidePanel",
					bottom: true,
					animation: "group-hover:animate-rotate-180 group-hover:animate-duration-[500ms]",
					i18n: "navbar.settings.label"
				}
			]
		});
		mainManager.main.appendChild(this._navbar);
    this._sidePanelManager.initialize();
  }
}

export const navbarManager = new NavbarManager();
