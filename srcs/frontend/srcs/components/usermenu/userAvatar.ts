import UserHandler from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";

export interface UserAvatarProps {
	sizeClass?: string;
	editable?: boolean;
	playerId?: string;
	isComputer?: boolean;
	disableClick?: boolean;
}

export type UserAvatarType = HTMLDivElement & { firstChild: HTMLImageElement } | HTMLAnchorElement & { firstChild: HTMLImageElement };

export default function createUserAvatar(props: UserAvatarProps = {
	editable: false
}): UserAvatarType {
	if (!props.sizeClass)
		props.sizeClass = "w-10 h-10";

	let href: string | undefined;
	if (!props.editable && !props.disableClick && !props.isComputer) {
		if (props.playerId)
			href = `/user?playerId=${props.playerId}`;
		else
			href = "/user";
	}

	const anchor = document.createElement("a");
	if (href) {
		anchor.href = href;
		anchor.target = "_blank";
	}

	const img = document.createElement("img");
	img.onerror = () => img.src = "/assets/images/default_avatar.svg";
	img.alt = "User Avatar";
	img.className = `select-none border-2 rounded-full object-cover ${props.sizeClass} bg-white`;

	img.src = "/assets/images/default_avatar.svg";
	if (!props.isComputer && (!props.playerId || props.playerId === UserHandler.userId))
		img.src = UserHandler.avatarUrl;
	else if (props.isComputer)
		img.src = "/assets/images/computer-virus-1-svgrepo-com.svg";
	else
		UserHandler.fetchUserPicture(props.playerId).then((url) => {
			img.src = url;
			if (img.src === UserHandler.avatarUrl)
				img.dataset.user = "avatar";
		});

	anchor.appendChild(img);

	const userAvatar = anchor as UserAvatarType;

	if (props.editable) {
		userAvatar.firstChild.onload = () => {
			const newContainer = document.createElement("div");
			newContainer.className = `relative rounded-full overflow-hidden ${props.sizeClass}`;
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
					userAvatar.firstChild.src = UserHandler.avatarUrl;
					return;
				}
				userAvatar.firstChild.src = URL.createObjectURL(file);
			};
			newContainer.appendChild(editContainer);
		}
	}

	return userAvatar;
}
