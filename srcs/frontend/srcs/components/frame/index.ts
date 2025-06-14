export function createFrame(): HTMLElement {
  const frame = document.createElement("div");

  frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark";
  frame.id = "frame";
  frame.innerHTML = `
    <main class="h-full w-full p-8">
        <canvas id="game" class="bg-red-200 h-full w-full"></canvas>
        </div>
      </main>
  `;

  return frame;
}