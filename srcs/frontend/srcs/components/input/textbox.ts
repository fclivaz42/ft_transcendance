export interface TextboxProps {
	placeholder?: string;
	value?: string;
	type?: "text" | "password" | "email" | "number";
	name?: string;
	id?: string;
}

export default function createTextbox(props: TextboxProps): HTMLInputElement {
	const textbox = document.createElement("input");
	textbox.type = props.type || "text";
	textbox.placeholder = props.placeholder || "";
	textbox.value = props.value || "";
	textbox.className = "w-full px-4 py-2 mt-2 text-gray-600 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 pr-10 transition-all duration-300 ease-in-out border-blue-500 focus:ring-blue-500 focus:border-blue-500";
	textbox.name = props.name || "";
	textbox.id = props.id || "";

	return textbox;	
}
