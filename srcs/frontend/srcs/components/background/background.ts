
// export function createBackgroundElement(): HTMLElement {
//     const container = document.createElement("div");
//     container.className = `
//       fixed inset-0 -z-10 overflow-hidden 
//       bg-gradient-to-br from-purple-900 to-blue-900
//     `;

//     container.innerHTML = `
//       <div id="gradients" class="w-full h-full relative blur-3xl">
//         <div class="absolute w-[80%] h-[80%] top-1/2 left-1/2 bg-[radial-gradient(circle,_rgba(18,113,255,0.8)_0%,_rgba(18,113,255,0)_50%)] mix-blend-hard-light animate-[moveVertical_30s_ease_infinite] transform -translate-x-1/2 -translate-y-1/2"></div>
//         <div class="absolute w-[80%] h-[80%] top-1/2 left-1/2 bg-[radial-gradient(circle,_rgba(221,74,255,0.8)_0%,_rgba(221,74,255,0)_50%)] mix-blend-hard-light animate-[spin_20s_linear_infinite] transform -translate-x-1/2 -translate-y-1/2"></div>
//         <div class="absolute w-full h-full top-0 left-0 pointer-events-none" id="interactive-bubble"></div>
//       </div>
//     `;
//     return container;
//   }

// components/background/background.ts

// export function createBackgroundElement(): HTMLElement {
//     const container = document.createElement("div");
//     container.className = `
//       fixed inset-0 -z-10 overflow-hidden 
//       bg-gradient-to-br from-purple-900 to-blue-900
//     `;

//     container.innerHTML = `
//       <div id="gradients" class="w-full h-full relative blur-3xl">
//         <div class="absolute w-[80%] h-[80%] top-1/2 left-1/2 bg-[radial-gradient(circle,_rgba(18,113,255,0.8)_0%,_rgba(18,113,255,0)_50%)] mix-blend-hard-light animate-[moveVertical_30s_ease_infinite] transform -translate-x-1/2 -translate-y-1/2"></div>
//         <div class="absolute w-[80%] h-[80%] top-1/2 left-1/2 bg-[radial-gradient(circle,_rgba(221,74,255,0.8)_0%,_rgba(221,74,255,0)_50%)] mix-blend-hard-light animate-[spin_20s_linear_infinite] transform -translate-x-1/2 -translate-y-1/2"></div>

//         <div 
//           id="interactive-bubble" 
//           class="absolute 
//                  w-96 h-96 
//                  bg-[radial-gradient(circle,_rgba(140,100,255,0.7)_0%,_rgba(140,100,255,0)_50%)] 
//                  mix-blend-hard-light 
//                  opacity-70 
//                  rounded-full 
//                  pointer-events-none" 
//           style="top: 0; left: 0;"
//         ></div>
//       </div>
//     `;
//     return container;
// }

// components/background/background.ts

export function createBackgroundElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = `
      fixed inset-0 -z-10 flex items-center justify-center 
      bg-white text-black text-5xl font-bold
    `;

    return container;
}