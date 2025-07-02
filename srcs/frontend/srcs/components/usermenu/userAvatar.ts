import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { userMenuManager } from "../../managers/UserMenuManager";

export interface UserAvatarProps {
	sizeClass?: string;
	editable?: boolean;
	playerId?: string;
	isComputer?: boolean;
	disableClick?: boolean;
}

export default async function createUserAvatar(props: UserAvatarProps = {
	editable: false
}): Promise<HTMLImageElement> {
	if (!props.sizeClass)
		props.sizeClass = "w-10 h-10";

	let src: string;
	if (!props.isComputer && (!props.playerId || props.playerId === UserHandler.userId))
		src = UserHandler.avatarUrl;
	else if (props.isComputer)
		src = "/assets/images/computer-virus-1-svgrepo-com.svg";
	else
		src = await UserHandler.fetchUserPicture(props.playerId);

	const template = document.createElement("template");
	template.innerHTML = `
		<img src="${sanitizer(src)}" ${src === UserHandler.avatarUrl ? "data-user=\"avatar\"": ""} alt="User Avatar" class="select-none border-2 rounded-full object-cover ${sanitizer(props.sizeClass)} bg-white">
	`;
	const userAvatar = template.content.firstElementChild as HTMLImageElement;

	userAvatar.onerror = () => {
		userAvatar.src = "/assets/images/default_avatar.svg";
	};

	if (!props.disableClick && !props.isComputer) {
		userAvatar.classList.add("cursor-pointer");
		userAvatar.onclick = () => {
			if (props.playerId && props.playerId !== UserHandler.userId) {
				RoutingHandler.setRoute(`/user?playerId=${props.playerId}`);
			} else {
				RoutingHandler.setRoute("/user");
			}
		};
		userAvatar.onauxclick = () => {
			if (props.playerId && props.playerId !== UserHandler.userId) {
				window.open(`/user?playerId=${props.playerId}`, "_blank");
			} else {
				window.open("/user", "_blank");
			}
		}
	}

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
			editContainer.className = `${props.sizeClass} p-8 bg-black/50 opacity-0 absolute bottom-0 right-0 rounded-full border-2 cursor-pointer select-none`;
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
