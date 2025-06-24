import { createHeader } from "../components/header/index.js";

class HeaderManager {
	private _header: HTMLDivElement = createHeader();
  public initialize() {
    const app = document.getElementById("app");
    if (!app) return;
    app.insertBefore(this._header, app.firstChild);
  }

	public get header(): HTMLDivElement {
		return this._header;
	}
}

export const headerManager = new HeaderManager();
