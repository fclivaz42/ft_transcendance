export function createHeader(): HTMLElement {
  const header = document.createElement("header");

  header.className = "z-20 bg-primary dark:bg-primary_dark p-2 flex justify-between align-middle";
  header.id = "header";
  header.innerHTML = `
      <div class="flex">
        <h1 class="text-lg my-auto h-fit font-bold">SARIF's PONG</h1>
      </div>
      <div class="flex gap-x-2" id="userMenu">
      </div>
  `;
  return header;
}