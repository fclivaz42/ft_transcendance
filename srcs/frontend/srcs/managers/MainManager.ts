class MainManager {
	private _main : HTMLDivElement = document.createElement("div");

	public initialize() : void {
		const template = document.createElement("template");
		template.innerHTML = `
			<main class="flex flex-grow h-full w-full" id="main">
			</main>
		`
		this._main = template.content.firstElementChild as HTMLDivElement;
		const app = document.getElementById("app");
		if (!app)
			throw new Error("App element not found");
		app.appendChild(this._main);
	}

	public get main() : HTMLDivElement {
		return this._main;
	}
}

export const mainManager = new MainManager();
