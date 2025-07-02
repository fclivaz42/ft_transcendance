import { sanitizer } from "../../../helpers/sanitizer";
import { TitleProps } from "../../../interfaces/baseProps";

export default function createHeaderFrame(props: TitleProps): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="bg-panel dark:bg-panel_dark p-4 rounded-lg shadow-lg mb-16 max-w-[980px] mx-auto">
			<h1 ${props.i18n ? `data-i18n=${sanitizer(props.i18n)}` : ""} class="text-2xl font-bold mb-4">${sanitizer(props.title)}</h1>
		</div>
	`;
	if (props.id)
		template.content.firstElementChild?.setAttribute("id", props.id);
	return template.content.firstElementChild as HTMLDivElement;
}
