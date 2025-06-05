import { InteractivBubble } from "../components/background/index.js";

export default class FrameManager {
  public initialize() {
    const main = document.getElementById("main");
    const frame = InteractivBubble();
    main?.appendChild(frame);
  }
}