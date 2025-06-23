import { createFrame } from "../components/frame/index.js";

class FrameManager {
  public initialize() {
    const main = document.getElementById("main");
    const frame = createFrame();
    main?.appendChild(frame);
  }
}

export const frameManager = new FrameManager();
