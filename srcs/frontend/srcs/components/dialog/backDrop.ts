export interface dialogBackdropProps {
	allowClose?: boolean;
}

export default function createDialogBackdrop(props: dialogBackdropProps) {
	let backdrop: HTMLDivElement;
	if (backdrop = document.getElementById('dialogBackdrop') as HTMLDivElement)
		backdrop.remove();
	const template = document.createElement('template');
	template.innerHTML = `
		<div id="dialogBackdrop" class="opacity-0 duration-300 fixed top-0 left-0 bottom-0 right-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
		<div>
	`;
	backdrop = template.content.firstElementChild as HTMLDivElement;
	if (props.allowClose) {
		backdrop.onclick = (event) => {
			if (event.target !== backdrop) return;
			const dialogs = document.querySelectorAll('dialog');
			for (const dialog of dialogs)
				dialog.remove();
			backdrop.remove();
		}
	}
	return backdrop;
}
