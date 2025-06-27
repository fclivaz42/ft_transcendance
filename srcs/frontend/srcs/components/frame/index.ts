export default function createFrame(): HTMLElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<main class="p-12 flex-grow w-full h-full bg-background dark:bg-background_dark overflow-x-auto">
		</main>
	`;
	const frame = template.content.firstElementChild as HTMLElement;

  return frame;
}
