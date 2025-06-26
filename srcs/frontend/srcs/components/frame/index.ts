export default function createFrame(): HTMLElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<main class="p-12 h-full flex-grow bg-background dark:bg-background_dark overflow-auto">
		</main>
	`;
	const frame = template.content.firstElementChild as HTMLElement;

  return frame;
}
