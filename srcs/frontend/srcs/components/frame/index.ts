export function createFrame(): HTMLElement {
  const frame = document.createElement("div");

  frame.className = "h-full w-full bg-white p-8";
  frame.id = "frame";
  frame.innerHTML = `
    <main class="h-full w-full bg-white p-8">
        <div class="bg-red-200 h-full w-full">
        </div>
      </main>
  `;

  return frame;
}