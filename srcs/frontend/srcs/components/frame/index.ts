export default function createFrame(): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<section class="pt-32 p-12 flex-grow  overflow-x-auto">
		</section>
	`;
	const frame = template.content.firstElementChild as HTMLElement;

  return frame;
}
