//barre laterale gauche [pong, history, settings]
import { createNavbar } from "../components/navbar/index.js";
import { i18nHandler } from "../handlers/i18nHandler.js";
import RoutingHandler from "../handlers/RoutingHandler.js";
import UserHandler from "../handlers/UserHandler.js";
import { mainManager } from "./MainManager.js";
import NotificationManager from "./NotificationManager.js";
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
					id: "btnHome",
					title: i18nHandler.getValue("navbar.home.label"),
					logo: "/assets/ui/home-svgrepo-com.svg",
					i18n: "navbar.home.label",
					f: () => {
						RoutingHandler.setRoute("/");
					}
				},
				{
					id: "btnPong",
					title: i18nHandler.getValue("navbar.pong.label"),
					logo: "/assets/ui/ping-pong-svgrepo-com.svg",
					panelId: "pongSidePanel",
					i18n: "navbar.pong.label",
				},
				{
					id: "btnFriend",
					title: i18nHandler.getValue("navbar.friend.label"),
					logo: "/assets/ui/friend-svgrepo-com.svg",
					panelId: "friendSidePanel",
					i18n: "navbar.friend.label",
				},
				{
					id: "btnHistory",
					title: i18nHandler.getValue("navbar.history.label"),
					logo: "/assets/ui/history-svgrepo-com.svg",
					//panelId: "historySidePanel",
					i18n: "navbar.history.label",
					f: () => {
						if (!UserHandler.isLogged) {
							NotificationManager.notify({
								message: i18nHandler.getValue("notification.user.notLogged"),
								level: "warning",
							});
							return;
						}
						RoutingHandler.setRoute("/history");
					}
				},
				{
					id: "btnProfile",
					title: i18nHandler.getValue("navbar.profile.label"),
					logo: "/assets/ui/profile-round-1342-svgrepo-com.svg",
					i18n: "navbar.profile.label",
					f: () => {
						if (!UserHandler.isLogged) {
							NotificationManager.notify({
								message: i18nHandler.getValue("notification.user.notLogged"),
								level: "warning",
							});
							return;
						}
						RoutingHandler.setRoute("/user");
					}
				},
				{
					id: "btnSettings",
					title: i18nHandler.getValue("navbar.settings.label"),
					logo: "/assets/ui/settings-svgrepo-com.svg",
					panelId: "settingsSidePanel",
					bottom: true,
					animation: "group-hover:animate-rotate-180 group-hover:animate-duration-[500ms]",
					i18n: "navbar.settings.label"
				},
			]
		});
		mainManager.main.appendChild(this._navbar);
    this._sidePanelManager.initialize();
  }
}

export const navbarManager = new NavbarManager();
