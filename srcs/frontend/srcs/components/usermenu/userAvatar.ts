import UserHandler from "../../handlers/UserHandler";

export interface UserAvatarProps {
	sizeClass?: string;
}

export default function createUserAvatar(props: UserAvatarProps = {sizeClass: "w-10 h-10"}): HTMLImageElement {
	const userAvatar = document.createElement("img");

	userAvatar.src = UserHandler.avatarUrl;
	userAvatar.alt = "User Avatar";
	userAvatar.onerror = () => {
		userAvatar.src = "/assets/images/default_avatar.svg";
	};
	userAvatar.className = `rounded-full object-cover ${props.sizeClass}`;

	return userAvatar;	
}
