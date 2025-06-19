import { i18nHandler } from "./handlers/i18nHandler.js";
import FrameManager from "./managers/FrameManager.js";
import HeaderManager from "./managers/HeaderManager.js";
import NavbarManager from "./managers/NavbarManager.js";
import UserMenuManager from "./managers/UserMenuManager.js";
import DarkmodeManager from "./handlers/DarkmodeHandler.js";
import BackgroundManager from "./managers/BackgroundManager.js";
import { startGame } from "./game/GameLaunch.js";
import HomeManager from "./managers/HomeManager.js";


// some rework is needed to make the code more readable and maintainable

// Initialize main container
const app = document.getElementById("app");
const main = document.createElement("div");
main.className = "flex flex-grow h-full w-full";
main.id = "main";
app?.appendChild(main);

// Initialize i18nHandler (language handler)
await i18nHandler.initialize().finally(() => {
  // Initialize dark mode
  const darkmodeManager = new DarkmodeManager();
  darkmodeManager.initialize();

  // Initialize header
  const headerManager = new HeaderManager();
  headerManager.initialize();

  // Initialize the managers
  const navbarManager = new NavbarManager();
  navbarManager.initialize();

  // const backgroundManager = new BackgroundManager();
  // backgroundManager.initialize();

   const homeManager = new HomeManager(); // NOUVEAU: Instanciez le HomeManager
  homeManager.initialize(main); // Passez 'main' comme parent pour la page d'accueil

  const frameManager = new FrameManager();
  frameManager.initialize();
  const userMenuManager = new UserMenuManager();
  userMenuManager.initialize();



  // note that the loginDialogManager is not initialized here, it is initialized on its own when needed (e.g., when the login button is clicked)
  // this should be the case for all dialog managers, as they are only needed when the user interacts with the UI
});
