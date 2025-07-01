import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import NotificationManager from "../../managers/NotificationManager";
import { createButton } from "../buttons";
import createUserAvatar from "../usermenu/userAvatar";

export default async function createUserFrame(): Promise<HTMLDivElement> {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	const user = await UserHandler.fetchUser(searchParams.get("playerId") || UserHandler.userId);
	if (!user)
		throw new Error("notification.user.notFound");
	template.innerHTML = `
		<div class="w-fit mx-auto flex flex-col gap-8">
			<div class="flex flex-col items-center justify-center gap-4">
				${createUserAvatar({ src: await UserHandler.fetchUserPicture(user?.PlayerID, user?.DisplayName, user?.Avatar), sizeClass: "w-40 h-40 mx-auto"}).outerHTML}
				<h2 data-user="username" class="text-center text-2xl font-bold"'>${UserHandler.displayName || "User Name"}</h2>
			</div>
			<div class="flex gap-8">
				<div>
					<h3 data-i18n="user.matches.won">${i18nHandler.getValue("user.matches.won")}</h3>
					<p data-user="matchesWon" class="text-center text-xl font-semibold">${0}</p>
				</div>
				<div class="mx-4">
					<h3 data-i18n="user.matches.lost">${i18nHandler.getValue("user.matches.lost")}</h3>
					<p data-user="matchesLost" class="text-center text-xl font-semibold">${0}</p>
				</div>
			</div>
		</div>
	`;
	const userFrame = template.content.firstElementChild as HTMLDivElement;
	const viewHistoryButton = createButton({
		i18n: "user.matches.viewHistory",
		f: () => RoutingHandler.setRoute(`/history?playerId=${user.PlayerID}`),
		title: i18nHandler.getValue("user.matches.viewHistory"),
	});
	userFrame.appendChild(viewHistoryButton);
	return userFrame;
}
