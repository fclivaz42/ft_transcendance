import { createFrame } from "../components/frame/index.js";

export default class FrameManager {
  public initialize() {
    const main = document.getElementById("main");
    const frame = createFrame();
    main?.appendChild(frame);
  }
}