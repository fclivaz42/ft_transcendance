import UserHandler from "../../handlers/UserHandler";
import { AiUsers } from "../../interfaces/AiUsers";
import { userMenuManager } from "../../managers/UserMenuManager";

export interface UserAvatarProps {
	sizeClass?: string;
	editable?: boolean;
	playerId?: string;
	disableClick?: boolean;
}

export type UserAvatarType = HTMLDivElement & { firstChild: HTMLImageElement } | HTMLAnchorElement & { firstChild: HTMLImageElement };

export default function createUserAvatar(props: UserAvatarProps = {
	editable: false
}): UserAvatarType {
	if (!props.sizeClass)
		props.sizeClass = "min-w-10 min-h-10 w-10 h-10";

	const anchor = document.createElement("a");

	const img = document.createElement("img");
	img.onerror = () => img.src = "/assets/images/default_avatar.svg";
	img.alt = "User Avatar";
	img.className = `select-none border-2 rounded-full object-cover ${props.sizeClass} bg-white`;
	img.src = "/assets/images/default_avatar.svg";

	if (props.playerId) {
		UserHandler.fetchUser(props.playerId).then((user) => {
			if (!user)
				user = UserHandler.user || AiUsers.values().next().value;
			else if (user.PlayerID === UserHandler.userId)
				img.setAttribute("data-user", "avatar");
			if(!props.editable && !props.disableClick) {
				anchor.href = `/user?playerId=${user!.PlayerID}`;
				anchor.target = "_blank";
			}
			img.src = user!.Avatar || `https://placehold.co/100x100?text=${user.DisplayName.substring(0, 2) || "?"}&font=roboto&bg=cccccc`;
		});
	}

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
