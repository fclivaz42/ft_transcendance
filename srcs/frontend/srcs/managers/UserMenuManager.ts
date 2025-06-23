import { createLoginButton, createLogoutButton, createRegisterButton } from "../components/buttons/index.js";
import createUserMenu, { createUserMenuSettings } from "../components/usermenu/index.js";
import { headerManager } from "./HeaderManager.js";

class UserMenuManager {
	private _userMenu: HTMLDivElement = createUserMenu();

  public initialize() {
		headerManager.header.appendChild
		fetch("/api/users/authorize", {
			method: "GET",
		}).then((response) => {
			if (!response.ok) {
				this._userMenu.appendChild(createLoginButton());
				return;
			}
			this._userMenu.append(createUserMenuSettings());
		});
		headerManager.header.appendChild(this._userMenu);
  }

	public get userMenu(): HTMLDivElement {	
		return this._userMenu;
	}
}

export const userMenuManager = new UserMenuManager();
