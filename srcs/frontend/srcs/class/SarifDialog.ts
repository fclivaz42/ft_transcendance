export default class SarifDialog extends HTMLDialogElement {
	public remove() {
		if (this.parentElement?.id === "dialogBackdrop") {
			this.parentElement.remove();
		}
		super.remove();
	}

	public showModal() {
		this.show();
	}

	public show() {
		if (this.parentElement?.id === "dialogBackdrop") {
			const parent = this.parentElement;
			requestAnimationFrame(() => {
				parent.classList.remove("opacity-0");
				parent.classList.add("opacity-100");
				this.classList.remove("scale-90");
				this.classList.add("scale-100");
			});
		}
		super.show();
	}

	public close() {
		this.remove();
	}
}
