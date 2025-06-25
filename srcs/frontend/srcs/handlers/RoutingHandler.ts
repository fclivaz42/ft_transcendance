import createHistoryFrame from "../components/frame/frameHistory";
import createHomeFrame from "../components/frame/frameHome";
import createLeaderboardFrame from "../components/frame/frameLeaderboard";
import createPongFrame from "../components/frame/framePong";
import createUserFrame from "../components/frame/frameUser";
import { NotificationDialogLevel, NotificationDialogLevels, NotificationProps } from "../components/notificationDialog";
import { frameManager } from "../managers/FrameManager";
import NotificationManager from "../managers/NotificationManager";
import { i18nHandler } from "./i18nHandler";

const validRoutes: Record<string, () => HTMLElement> = {
	"/": createHomeFrame,
	"/history": createHistoryFrame,
	"/leaderboard": createLeaderboardFrame,
	"/user": createUserFrame,
	"/pong": createPongFrame,
	"play": createPongFrame,
};

class RoutingHandler {
	private _url: URL = new URL(window.location.href);

	initialize(): void {
		window.addEventListener("popstate", () => {
			this.displayRoute();
		});

		window.addEventListener("load", () => {
			this.displayRoute();
		});

		this.displayRoute();
	}

	displayNotification(props: NotificationProps) {
		NotificationManager.notify(props);
	}

	displayRoute(): void {
		this._url = new URL(window.location.href);
		for(const param of this._url.searchParams.keys()) {
			if (NotificationDialogLevels.includes(param as NotificationDialogLevel)) {
				const message = this._url.searchParams.get(param) || "No message provided";
				this._url.searchParams.delete(param);
				this.displayNotification({
					title: i18nHandler.getValue(message.split(";")[0]) || "Notification",
					message: i18nHandler.getValue(message.split(";")[1]),
					level: param as NotificationDialogLevel,
				});
			}
		}
		window.history.replaceState({}, "", this._url.toString());

		const currentRoute = window.location.pathname;
		if (validRoutes[currentRoute]) {
			frameManager.frameChild = validRoutes[currentRoute]();
		} else {
			console.warn(`No component found for route: ${currentRoute}`);
			frameManager.frame.innerHTML = "<h1>404 Not Found</h1>";
		}
	}

	setRoute(route: string): void {
		const url = new URL(route, window.location.origin);
		if (!validRoutes[url.pathname]) {
			console.warn(`Invalid route: ${url.pathname}`);
			return;
		}
		window.history.pushState({}, "", url);
		this.displayRoute();
	}

	get url(): URL {
		return this._url;
	}

	get searchParams(): URLSearchParams {
		return this._url.searchParams;
	}
}

export default new RoutingHandler();
