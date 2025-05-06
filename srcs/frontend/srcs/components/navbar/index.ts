interface NavbarProps {
  buttons: {
      id: string;
      title: string;
      logo?: string;
      panelId?: string;
      bottom?: boolean;
      animation?: string;
    }[]
}

export function createNavbar(props: NavbarProps): HTMLElement {
  const navBar = document.createElement("nav");

  navBar.className = "h-full w-fit flex flex-grow pt-4 bg-navbar dark:bg-navbar_dark dark:border-panel_dark dark:border-r";
  navBar.id = "navBar";
  navBar.innerHTML = `
      <div class="flex flex-col flex-grow justify-between w-fit">
        <div class="flex-col w-fit flex-grow" id="navBarButtons">
          ${props.buttons.map((option) => `
            <a class="group w-24 h-24 overflow-visible flex flex-col items-center justify-center gap-y-1 cursor-pointer${option.bottom? " fixed bottom-0" : ""}" id="${option.id}" data-panel="${option.panelId}">
              ${option.logo ? `<img class="h-8 w-8 dark:invert ${option.animation || " group-hover:animate-squeeze group-hover:animate-duration-300"}" src="${option.logo}">` : ""}
              <p class="text-nowrap">${option.title}</p>
            </a>
          `).join("")}
        </div>
      </div>
  `;
  return navBar;
}
