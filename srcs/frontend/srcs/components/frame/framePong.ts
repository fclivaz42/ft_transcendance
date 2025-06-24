import RoutingHandler from "../../handlers/RoutingHandler";

export default function createPongFrame(): HTMLElement {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="absolute top-10 left-10 bottom-10 right-10 flex items-center justify-center">
			<div class="aspect-[2/1] w-full max-h-full">
				<div class="aspect-[2/1] max-w-full h-full mx-auto">
					<canvas id="game" class=" bg-panel dark:bg-panel_dark w-full h-full"></canvas>
				</div>
			</div>
		</div>
	`;
	const pongFrame = template.content.firstElementChild as HTMLElement;
	return pongFrame;
}
