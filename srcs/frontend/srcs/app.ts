import FrameManager from "./managers/FrameManager.js";
import HeaderManager from "./managers/HeaderManager.js";
import NavbarManager from "./managers/NavbarManager.js";
import SidePanelManager from "./managers/SidePanelManager.js";
import UserMenuManager from "./managers/UserMenuManager.js";

// some rework is needed to make the code more readable and maintainable

// Initialize header
const headerManager = new HeaderManager();

// Initialize main container
const app = document.getElementById("app");
const main = document.createElement("div");
main.className = "flex h-full w-full pt-4";
main.id = "main";
app?.appendChild(main);

// Initialize the managers
const navbarManager = new NavbarManager();
const frameManager = new FrameManager();
const sidePanelManager = new SidePanelManager();
const userMenuManager = new UserMenuManager();