import { BaseProps } from "../../interfaces/baseProps.js";

interface NavbarButtonProps extends BaseProps {
  title: string;
  logo?: string;
  panelId?: string;
  bottom?: boolean;
  animation?: string;
}

interface NavbarProps {
  buttons: NavbarButtonProps[]
}

export function createNavbar(props: NavbarProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "w-24";

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

  navBar.className = "z-10 fixed top-0 bottom-0 flex pt-20 bg-navbar dark:bg-navbar_dark dark:border-panel_dark dark:border-r";
  navBar.id = "navBar";
  navBar.innerHTML = `
    <div class="w-24 flex flex-col flex-grow">
      <div class="flex-col flex-grow flex" id="navBarButtons">
        ${props.buttons.map((option) => `
          <a class="group aspect-square overflow-visible flex flex-col items-center justify-center gap-y-1 cursor-pointer${option.bottom? " mt-auto":""}" id="${option.id}" data-panel="${option.panelId}">
            ${option.logo ? `<img class="select-none h-8 w-8 dark:invert ${option.animation || " group-hover:animate-squeeze group-hover:animate-duration-300"}" src="${option.logo}">` : ""}
            <p class="text-nowrap" ${option.i18n ? ` data-i18n="${option.i18n}"` : ""}>${option.title}</p>
          </a>
        `).join("")}
      </div>
    </div>
  `;
  container.appendChild(navBar);
  return container;
}

