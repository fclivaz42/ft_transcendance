import createFrame from "../components/frame/index.js";
import { mainManager } from "./MainManager.js";

class FrameManager {
	private _frame: HTMLElement = createFrame();
  public initialize() {
		mainManager.main.appendChild(this._frame);
  }
	public get frame(): HTMLElement {
		return this._frame;
	}
}

export const frameManager = new FrameManager();
