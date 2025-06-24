import { InteractivBubble } from "../components/background/index.js";
import { mainManager } from "./MainManager.js";

export default class FrameManager {
  public initialize() {
    const frame = InteractivBubble();
		mainManager.main.appendChild(frame);
  }
}
