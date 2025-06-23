import { createFrame } from "../components/frame/index.js";
import { mainManager } from "./MainManager.js";

class FrameManager {
  public initialize() {
    const frame = createFrame();
		mainManager.main.appendChild(frame);
  }
}

export const frameManager = new FrameManager();
