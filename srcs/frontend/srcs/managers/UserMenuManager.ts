import { createLoginButton, createLogoutButton, createRegisterButton } from "../components/buttons/index.js";
import createUserMenu, { createUserMenuSettings } from "../components/usermenu/index.js";
import UserHandler from "../handlers/UserHandler.js";
import { headerManager } from "./HeaderManager.js";

class UserMenuManager {
	private _userMenu: HTMLDivElement = createUserMenu();
	private _uploadFile: HTMLInputElement = document.createElement("input");

  public initialize() {
		this._uploadFile.type = "file";
		this._uploadFile.accept = "image/*";
		this.update();
		headerManager.header.appendChild(this._userMenu);
  }

	public update() {
		this._userMenu.innerHTML = "";
		if (UserHandler.isLogged)
			this._userMenu.appendChild(createUserMenuSettings());
		else
			this._userMenu.appendChild(createLoginButton());
		this._uploadFile.files = null;
	}

	public get userMenu(): HTMLDivElement {	
		return this._userMenu;
	}

	public get uploadFile(): HTMLInputElement {
		return this._uploadFile;
	}
}

export const userMenuManager = new UserMenuManager();
