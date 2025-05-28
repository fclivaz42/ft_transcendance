export interface DialogProps {
  allowClose?: boolean;
  child?: HTMLElement;
}

export function createDialog(props?: DialogProps): HTMLDialogElement {
  const dialog = document.createElement("dialog");

  props?.id && (dialog.id = props.id);
  
  if (props?.allowClose) {
    const closeButton = document.createElement("button");
    closeButton.className = "select-none border-0 m-0 p-0 text-3xl absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100";
    closeButton.innerHTML = "×";
    closeButton.onclick = () =>
      dialog.remove();
    dialog.appendChild(closeButton);
  }

  if (props?.child) {
    dialog.appendChild(props.child);
  }

  dialog.className = "bg-white p-8 bg-background dark:bg-background_dark border-0 rounded-lg shadow-lg flex flex-col justify-center items-center gap-y-4 text-black dark:text-white";

  return dialog;
}