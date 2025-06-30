import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import createHeaderFrame from "./components/frameHeader";

export interface httpErrorsRessources {
	404: {
		images: string[];
	};
}

export default async function create404Frame(): Promise<HTMLDivElement> {
	const searchParams = RoutingHandler.searchParams;
	const template = document.createElement("template");
	let imageSrcs: httpErrorsRessources | undefined;
	await fetch("/assets/httpErrors/ressources.json").then(async response => {
		if (!response.ok) {
			console.error("Failed to fetch resources for 404 frame:", response.statusText);
			return;
		}
		imageSrcs = await response.json() as httpErrorsRessources;
	}).catch(error => {
		console.error("Error fetching resources for 404 frame:", error);
	});
	template.innerHTML = `
		<div class="w-full h-full flex flex-col items-center justify-start gap-4 pt-24">
			${imageSrcs ? `
				<img src=${imageSrcs[404].images[Math.floor(Math.random() * imageSrcs[404].images.length)]} alt="404 Not Found" class="w-auto h-72 object-cover mb-4 rounded-lg shadow-lg">
			`: ""}
			<h1 class="text-4xl font-bold text-center mb-4" id="error-title" data-i18n="errors.http.404.title" i18n="${searchParams.get("i18n") || "errors.http.404.title"}" i18n-params='{"title": "${i18nHandler.getValue("errors.http.404.title")}", "message": "${i18nHandler.getValue("errors.http.404.message")}"}'>
				${i18nHandler.getValue("errors.http.404.title")}
			</h1>
			<p class="text-lg text-center" id="error-message" data-i18n="errors.http.404.message" i18n="${searchParams.get("i18n") || "errors.http.404.message"}" i18n-params='{"title": "${i18nHandler.getValue("errors.http.404.title")}", "message": "${i18nHandler.getValue("errors.http.404.message")}"}'>
				${i18nHandler.getValue("errors.http.404.message")}
			</p>
		</div>
	`;
	const notFoundFrame = template.content.firstElementChild as HTMLDivElement;
	return notFoundFrame;
}
