import { i18nHandler } from "./handlers/i18nHandler.js";
import { frameManager } from "./managers/FrameManager.js";
import { headerManager } from "./managers/HeaderManager.js";
import { navbarManager } from "./managers/NavbarManager.js";
import { userMenuManager } from "./managers/UserMenuManager.js";
import { darkmodeManager } from "./handlers/DarkmodeHandler.js";
import BackgroundManager from "./managers/BackgroundManager.js";
import HomeManager from "./managers/HomeManager.js";
import ElementsHandler from "./handlers/ElementsHandler.js";
import UserHandler from "./handlers/UserHandler.js";
import { mainManager } from "./managers/MainManager.js";


// some rework is needed to make the code more readable and maintainable

// Initialize main container
mainManager.initialize();

// Custom elements initialization
ElementsHandler.initialize();

// Initialize the user handler
await UserHandler.initialize();

// language initialization
await i18nHandler.initialize();

darkmodeManager.initialize();

// Initialize components
headerManager.initialize();
navbarManager.initialize();

// const backgroundManager = new BackgroundManager();
// backgroundManager.initialize();

// // WARN: freeze le site
// const homeManager = new HomeManager(); // NOUVEAU: Instanciez le HomeManager
// homeManager.initialize(main); // Passez 'main' comme parent pour la page d'accueil

frameManager.initialize();
userMenuManager.initialize();

// note that the loginDialogManager is not initialized here, it is initialized on its own when needed (e.g., when the login button is clicked)
// this should be the case for all dialog managers, as they are only needed when the user interacts with the UI
