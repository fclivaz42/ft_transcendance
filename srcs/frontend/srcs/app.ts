import { i18nHandler } from "./handler/i18nHandler.js";
import FrameManager from "./managers/FrameManager.js";
import HeaderManager from "./managers/HeaderManager.js";
import NavbarManager from "./managers/NavbarManager.js";
import UserMenuManager from "./managers/UserMenuManager.js";
import DarkmodeManager from "./handler/DarkmodeHandler.js";

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
  const frameManager = new FrameManager();
  frameManager.initialize();
  const userMenuManager = new UserMenuManager();
  userMenuManager.initialize();
});