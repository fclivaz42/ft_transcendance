import { createHeader } from "../components/header";

export default class HeaderManager {
  constructor() {
    const app = document.getElementById("app");

    const header = createHeader();
    app?.appendChild(header);
  }
}