import { i18nHandler } from "./handlers/i18nHandler.js";
import { frameManager } from "./managers/FrameManager.js";
import { headerManager } from "./managers/HeaderManager.js";
import { navbarManager } from "./managers/NavbarManager.js";
import { darkmodeManager } from "./handlers/DarkmodeHandler.js";
import ElementsHandler from "./handlers/ElementsHandler.js";
import UserHandler from "./handlers/UserHandler.js";
import { mainManager } from "./managers/MainManager.js";
import RoutingHandler from "./handlers/RoutingHandler.js";


// some rework is needed to make the code more readable and maintainable

// language initialization
await i18nHandler.initialize();

// Custom elements initialization
ElementsHandler.initialize();

// Initialize the user handler
await UserHandler.initialize();

// Initialize the routing handler
RoutingHandler.initialize();

// Initialize main container
mainManager.initialize();

darkmodeManager.initialize();

// Initialize components
headerManager.initialize();
navbarManager.initialize();

frameManager.initialize();

// note that the loginDialogManager is not initialized here, it is initialized on its own when needed (e.g., when the login button is clicked)
// this should be the case for all dialog managers, as they are only needed when the user interacts with the UI

if (localStorage.getItem("gdprAcceptedVersion") !== i18nHandler.getValue("panel.gdpr.version")) {
	const { createGdprNotice } = await import("./components/dialog/gdprNotice/index.js");
	createGdprNotice();
}
