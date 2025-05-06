interface NavbarProps {
  buttons: {
      id: string;
      title: string;
      logo?: string;
      panelId?: string;
    }[]
}

export function createNavbar(props: NavbarProps): HTMLElement {
  const navBar = document.createElement("nav");

  navBar.className = "h-full w-fit flex delay-1000 pt-4";
  navBar.id = "navBar";
  navBar.innerHTML = `
        <div class="flex flex-col justify-between w-fit">
        <div class="flex-col w-fit max-h-[80vh] overflow-y-auto scrollbar-thin" id="navBarButtons">
          ${props.buttons.map((option) => `
            <a class="w-24 h-24 overflow-visible flex flex-col items-center justify-center gap-y-1 cursor-pointer" id="${option.id}" data-panel="${option.panelId}">
              ${option.logo ? `<img class="h-8 w-8" src="${option.logo}">` : ""}
              <p class="text-nowrap">${option.title}</p>
            </a>
          `).join("")}
        </div>
        <div class="w-fit">
          <a class="w-24 h-24 overflow-visible flex flex-col items-center justify-center gap-y-1 cursor-pointer" id="btnSettings data-panel="settingsSidePanel">
            <img class="h-8 w-8" src="./assets/ui/settings-svgrepo-com.svg">
            <p>Settings</p>
          </a>
        </div>
      </div>
  `;
  return navBar;
}
