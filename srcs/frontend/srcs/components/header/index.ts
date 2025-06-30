export function createHeader(): HTMLDivElement {
  const template = document.createElement("template");

	template.innerHTML = `
		<header id="template" class="fixed top-0 left-0 right-0 min-h-16 h-16 z-20 bg-primary dark:bg-primary_dark py-2 px-8 flex justify-between align-middle">
		  <div class="flex">
        <h1 class="text-lg my-auto h-fit font-bold">SARIF's PONG</h1>
      </div>
      <div class="flex gap-x-2" id="userMenu">
      </div>
		</header>
	`
  return template.content.firstElementChild as HTMLDivElement;
}
