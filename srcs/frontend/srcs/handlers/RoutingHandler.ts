import createHistoryFrame from "../components/frame/frameHistory";
import createHomeFrame from "../components/frame/frameHome";
import createLeaderboardFrame from "../components/frame/frameLeaderboard";
import createPongFrame from "../components/frame/framePong";
import createUserFrame from "../components/frame/frameUser";
import { frameManager } from "../managers/FrameManager";

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

	displayRoute(): void {
		this._searchParams = new URLSearchParams(window.location.search);
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
