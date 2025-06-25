import { i18nHandler } from "../../handlers/i18nHandler.js";
import UserHandler from "../../handlers/UserHandler.js";
import { createButton } from "./index.js";

export function createLogoutButton(): HTMLElement {
	const i18nId = "header.usermenu.logout";
  return createButton({
    title: i18nHandler.getValue(i18nId),
    logo: "/assets/ui/login-door-1-svgrepo-com.svg",
    color: "bg-red-100",
		darkColor: "dark:bg-red-400",
		f: () => {
			fetch("/api/users/logout", {
				method: "GET",
			}).then((response) => {
				if (response.ok)
					UserHandler.fetchUser();
			});
		},
    id: "logoutButton",
    i18n: i18nId,
  });
}
