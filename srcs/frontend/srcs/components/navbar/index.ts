import { sanitizer } from "../../helpers/sanitizer.js";
import { BaseProps } from "../../interfaces/baseProps.js";

interface NavbarButtonProps extends BaseProps {
  title: string;
  logo?: string;
  panelId?: string;
  bottom?: boolean;
  animation?: string;
	f?: () => void;
}

interface NavbarProps {
  buttons: NavbarButtonProps[]
}

export function createNavbar(props: NavbarProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "w-24 min-w-24";

  const navBar = document.createElement("nav");

  let bottomTrigger = false;
  props.buttons.forEach((button) => {
    if (!bottomTrigger) {
      if (button.bottom == true)
        bottomTrigger = true;
    } else {
      button.bottom = false;
    }
  });

  navBar.className = "z-10 fixed top-0 bottom-0 flex pt-20 bg-navbar border-panel border-r dark:bg-navbar_dark dark:border-panel_dark dark:border-r";
  navBar.id = "navBar";
  navBar.innerHTML = `
    <div class="w-24 flex flex-col flex-grow">
      <div class="flex-col flex-grow flex" id="navBarButtons">
      </div>
    </div>
  `;
	const navBarButtons = navBar.querySelector("#navBarButtons");
	for (const button of props.buttons) {
		const template = document.createElement("template");
		template.innerHTML = `
			<a class="group aspect-square overflow-visible flex flex-col items-center justify-center gap-y-1 cursor-pointer${button.bottom ? " mt-auto" : ""}" id="${sanitizer(button.id)}">
				${button.logo ? `<img class="select-none h-8 w-8 dark:invert ${sanitizer(button.animation) || " group-hover:animate-squeeze group-hover:animate-duration-300"}" src="${sanitizer(button.logo)}">` : ""}
				<p class="text-nowrap" ${button.i18n ? ` data-i18n="${sanitizer(button.i18n)}"` : ""}>${sanitizer(button.title)}</p>
			</a>
		`;
		const buttonElement = template.content.firstElementChild as HTMLElement;
		if (button.f)
			buttonElement.onclick = button.f;
		if (button.panelId) {
			buttonElement.setAttribute("data-panel", button.panelId);
		}
		navBarButtons?.appendChild(buttonElement);
	}
  container.appendChild(navBar);
  return container;
}

