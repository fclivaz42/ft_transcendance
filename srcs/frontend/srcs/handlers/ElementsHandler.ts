import BackdropDialog from "../class/BackdropDialog"
import NotificationDialog from "../class/NotificationDialog";

class ElementHandler {
	public initialize() {
		customElements.define("sarif-dialog", BackdropDialog, { extends: "dialog" });
		customElements.define("notification-dialog", NotificationDialog, { extends: "dialog" });
	}
}

export default new ElementHandler();
