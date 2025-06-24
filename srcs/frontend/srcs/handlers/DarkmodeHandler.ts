class DarkmodeManager {
  public initialize(): void {
    const darkModeSetting = localStorage.getItem("darkMode");
    if (darkModeSetting) {
      if (darkModeSetting === "true") {
        document.body.classList.add("dark");
      }
    }
    else {
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkModeMediaQuery.matches) {
        document.body.classList.add("dark");
      }
    }
  }
}

export const darkmodeManager = new DarkmodeManager();
