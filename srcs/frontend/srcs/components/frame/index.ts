export default function createFrame(): HTMLElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<main class="h-full w-full p-8 bg-background dark:bg-background_dark relative">
		</main>
	`;

	const frame = template.content.firstElementChild as HTMLElement;

  return frame;
}
