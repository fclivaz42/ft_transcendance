import { createNavbar } from "../components/navbar/index.js";

export default class NavbarManager {
  constructor() {
    const main = document.getElementById("main");
    const navBar = createNavbar({
      options: [
        {
          id: "btnPong",
          title: "Pong",
          logo: "./assets/ui/leaderboard-svgrepo-com.svg"
        },
        {
          id: "btnBonusGame",
          title: "Bonus Game",
          logo: "./assets/ui/leaderboard-svgrepo-com.svg"
        },
      ]
    });
    main?.appendChild(navBar);
  }
}