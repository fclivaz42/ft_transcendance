import SarifDialog from "../class/SarifDialog"

class ElementHandler {
	public initialize() {
		customElements.define("sarif-dialog", SarifDialog, { extends: "dialog" });
	}
}

export default new ElementHandler();
