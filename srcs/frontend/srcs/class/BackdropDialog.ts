export default class BackdropDialog extends HTMLDialogElement {
	constructor() {
		super();
		const container = document.createElement("div");
		container.className = "outline-none w-full p-8 flex flex-col items-center gap-y-4 overflow-y-auto overflow-x-hidden";
		super.appendChild(container);
	}

	public remove() {
		if (this.parentElement?.id === "dialogBackdrop")
			this.parentElement.remove();
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

	public appendChild<T extends Node>(child: T): T {
		if (this.firstElementChild) {
			this.firstElementChild.appendChild(child);
		} else {
			const container = document.createElement("div");
			container.appendChild(child);
			super.appendChild(container);
		}
		return child;
	}

	public get innerHTML(): string {
		return this.firstElementChild ? this.firstElementChild.innerHTML : "";
	}

	public set innerHTML(value: string) {
		if (this.firstElementChild) {
			this.firstElementChild.innerHTML = value;
		} else {
			const container = document.createElement("div");
			container.innerHTML = value;
			super.appendChild(container);
		}
	}
}
