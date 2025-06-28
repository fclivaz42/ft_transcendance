import createDialogBackdrop, { dialogBackdropProps } from './backDrop.js';
import BackdropDialog from '../../class/BackdropDialog.js';

export { createLoginPanel } from './loginPanel.js';
export { createRegisterPanel } from './registerPanel.js';
export { createForgotPasswordPanel } from './forgotPswPanel.js';

export interface DialogProps {
  allowClose?: boolean;
  child?: HTMLElement;
}

export function createDialog(props?: DialogProps): BackdropDialog {
	const backdrop = createDialogBackdrop(props as dialogBackdropProps);
	const dialog = document.createElement("dialog", { is: "sarif-dialog" }) as BackdropDialog;
  
  if (props?.allowClose) {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" )
				dialog.remove();
		});
    const closeButton = document.createElement("button");
    closeButton.className = "dark:text-white absolute -top-6 -right-6 z-50 w-10 h-10 text-3xl font-bold bg-background dark:bg-black/70 rounded-md flex items-center justify-center cursor-pointer dark:hover:text-red-500 hover:text-red-500 hover:bg-blue-100 dark:hover:bg-black/90 shadow-lg select-none focus:outline-none";
    closeButton.innerHTML = "×";
    closeButton.onclick = () => dialog.remove();
    dialog.appendChild(closeButton);
  }

  if (props?.child) {
    dialog.appendChild(props.child);
  }

  dialog.className = "fixed scale-90 duration-300 left-0 right-0 top-0 bottom-0 p-8 bg-background dark:bg-background_dark border-0 rounded-lg shadow-lg flex flex-col justify-center items-center gap-y-4 text-black dark:text-white overflow-visible ";

	backdrop.appendChild(dialog);
	document.body.appendChild(backdrop);
	return dialog;
}
