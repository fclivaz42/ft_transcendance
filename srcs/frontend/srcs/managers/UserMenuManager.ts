import { createLoginButton, createLogoutButton, createRegisterButton } from "../components/buttons/index.js";

function getCookie(name: string): string | null {
  let dc = document.cookie;
  let prefix = name + "=";
  let begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
  }
  let end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }
  return decodeURIComponent(dc.substring(begin, end));
}

export default class UserMenuManager {
  public initialize() {
    const userMenu = document.getElementById("userMenu");
		if (!getCookie("session")) {
      // userMenu?.appendChild(createRegisterButton());
			fetch("/users/authorize", {
				method: "GET",
			}).then((response) => {
				if (response.ok)
					userMenu?.appendChild(createLogoutButton());
				else // TODO: Create a "user" button with username
					userMenu?.appendChild(createLoginButton());
			});
    }
    else {
      userMenu?.appendChild(createLogoutButton());
    }
  }
}
