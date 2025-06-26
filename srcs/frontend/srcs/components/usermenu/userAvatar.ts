import UserHandler from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";

export interface UserAvatarProps {
	sizeClass?: string;
	editable?: boolean;
}

export default function createUserAvatar(props: UserAvatarProps = {
	sizeClass: "w-10 h-10",
	editable: false
}): HTMLImageElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<img data-user="avatar" src="${UserHandler.avatarUrl}" alt="User Avatar" class="border-2 rounded-full object-cover ${props.sizeClass}">
	`;
	const userAvatar = template.content.firstElementChild as HTMLImageElement;

	userAvatar.onerror = () => {
		userAvatar.src = "/assets/images/default_avatar.svg";
	};

	if (props.editable) {
		userAvatar.onload = () => {
			const newContainer = document.createElement("div");
			newContainer.className = "relative rounded-full overflow-hidden";
			userAvatar.classList.add("cursor-pointer");
			if (!userAvatar.parentElement)
				throw new Error("User avatar must have a parent element to replace it.");
			userAvatar.parentElement.replaceChild(newContainer, userAvatar);
			newContainer.appendChild(userAvatar);
			const editContainer = document.createElement("div");
			editContainer.className = `${props.sizeClass} p-8 bg-black/50 opacity-0 absolute bottom-0 right-0 rounded-full border-2 cursor-pointer`;
			const editIcon = document.createElement("img");
			editIcon.src = "/assets/ui/photo-upload-svgrepo-com.svg";
			editIcon.className = `w-full h-full invert`;
			editContainer.appendChild(editIcon);
			editContainer.onmouseenter = () => {
				editContainer.classList.remove("opacity-0");
				editContainer.classList.add("opacity-100");
			};
			editContainer.onmouseleave = () => {
				editContainer.classList.remove("opacity-100");
				editContainer.classList.add("opacity-0");
			};
			editContainer.onclick = () => {
				userMenuManager.uploadFile.value = "";
				userMenuManager.uploadFile.click();
			};
			userMenuManager.uploadFile.onchange = async () => {
				const file = userMenuManager.uploadFile.files?.[0];
				if (!file) {
					userAvatar.src = UserHandler.avatarUrl;
					return;
				}
				userAvatar.src = URL.createObjectURL(file);
			};
			newContainer.appendChild(editContainer);
		}
	}

	return userAvatar;	
}
