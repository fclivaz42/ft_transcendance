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
};

class RoutingHandler {
	private _searchParams: URLSearchParams = new URLSearchParams(window.location.search);

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
		this._searchParams = new URLSearchParams(window.location.search);
		for(const param of this._searchParams.keys()) {
			if (NotificationDialogLevels.includes(param as NotificationDialogLevel)) {
				const message = this._searchParams.get(param) || "No message provided";
				this._searchParams.delete(param);
				this.displayNotification({
					title: i18nHandler.getValue(message.split(";")[0]) || "Notification",
					message: i18nHandler.getValue(message.split(";")[1]),
					level: param as NotificationDialogLevel,
				});
			}
		}
		if (this._searchParams.toString()) 
			window.history.replaceState({}, "", `${window.location.pathname}?${this._searchParams.toString()}`);
		else
			window.history.replaceState({}, "", window.location.pathname);

		frameManager.frame.innerHTML = "";
		const currentRoute = window.location.pathname;
		if (validRoutes[currentRoute]) {
			frameManager.frame.appendChild(validRoutes[currentRoute]());
		} else {
			console.warn(`No component found for route: ${currentRoute}`);
			frameManager.frame.innerHTML = "<h1>404 Not Found</h1>";
		}
	}

	setRoute(route: string): void {
		if (!validRoutes[route]) {
			console.warn(`Invalid route: ${route}`);
			return;
		}
		window.history.pushState({}, "", route);
		this.displayRoute();
	}

	get searchParams(): URLSearchParams {
		return this._searchParams;
	}
}

export default new RoutingHandler();
