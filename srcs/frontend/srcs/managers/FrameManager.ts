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
	public set frameChild(value: HTMLElement) {
		this._frame.innerHTML = "";
		this._frame.appendChild(value);
	}
}

export const frameManager = new FrameManager();
