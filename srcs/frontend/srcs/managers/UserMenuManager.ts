import { createLoginButton, createLogoutButton, createRegisterButton } from "../components/buttons/index.js";
import createUserContext from "../components/usermenu/index.js";

export default class UserMenuManager {
  public initialize() {
    const userMenu = document.getElementById("userMenu");
		fetch("/users/authorize", {
			method: "GET",
		}).then((response) => {
			if (!response.ok) {
				userMenu?.appendChild(createLoginButton());
				return;
			}
			userMenu?.append(createUserContext());
			//userMenu?.appendChild(createLogoutButton());				
		});
  }
}
