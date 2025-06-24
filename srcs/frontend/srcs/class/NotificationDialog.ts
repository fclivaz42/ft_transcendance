export default class NotificationDialog extends HTMLDialogElement {
	public show() {
		requestAnimationFrame(() => {
			this.classList.remove("opacity-0");
			this.classList.add("opacity-100");
		});
		super.show();
		setTimeout(() => {
			this.classList.remove("opacity-100");
			this.classList.add("opacity-0");
			setTimeout(() => {
				this.remove();
			}, this.className.includes("duration-") ? parseInt(this.className.match(/duration-(\d+)/)?.[1] || "200") : 200);
		}, 3000);
	}

	public showModal() {
		this.show();
	}

	public close() {
		this.remove();
	}
}
