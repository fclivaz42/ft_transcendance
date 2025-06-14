export function createFrame(): HTMLElement {
  const frame = document.createElement("div");

  frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark";
  frame.id = "frame";
  frame.innerHTML = `
    <main class="h-full w-full p-8">
      <canvas id="game" class="h-full w-full m-0 p-0"></canvas>
    </main>
  `;

  return frame;
}