// srcs/components/background/background.ts

export function createBackgroundElement(): HTMLElement {
    const container = document.createElement("div");
    // Changé de 'fixed' à 'absolute' pour être contenu dans la frame
    // Suppression de '-z-10' car le z-index sera géré par la frame
    container.className = `
      absolute inset-0 bg-gray-900 overflow-hidden 
      relative // Toujours relative pour que ses enfants absolus se positionnent par rapport à lui
    `;
    container.id = "interactive-background-container"; 

    // Les mêmes formes et la bulle du curseur
    container.innerHTML = `
        <div id="shape1" class="absolute w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-60 filter blur-3xl" style="left: 20%; top: 30%;"></div>
        <div id="shape2" class="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 opacity-70 filter blur-3xl" style="left: 60%; top: 10%;"></div>
        <div id="shape3" class="absolute w-80 h-80 rounded-full bg-gradient-to-tl from-green-400 to-yellow-400 opacity-50 filter blur-3xl" style="left: 10%; top: 70%;"></div>
        <div id="shape4" class="absolute w-72 h-72 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-65 filter blur-3xl" style="left: 80%; top: 50%;"></div>
        
        <div id="cursor-bubble" class="absolute w-24 h-24 rounded-full bg-blue-400 opacity-80 filter blur-xl pointer-events-none"></div>
    `;

    return container;
}