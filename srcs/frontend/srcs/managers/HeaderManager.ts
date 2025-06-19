import { createHeader } from "../components/header/index.js";

export default class HeaderManager {
  public initialize() {
    const app = document.getElementById("app");
    if (!app) return;
    app.insertBefore(createHeader(), app.firstChild);
  }
}