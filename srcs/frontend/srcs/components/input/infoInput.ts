//Cree un champ de input de type texte, defini  en gris dedans ce qui est requis
export function createInfoInput(placeholder: string, name: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.placeholder = placeholder;
  
   
    input.className = `
      w-full
      px-4
      py-2
      mt-2
      text-white
      bg-gray-800
      border
      border-gray-700
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      dark:bg-white
      dark:text-black
    `.replace(/\s+/g, " "); // Nettoie les espaces
  
    return input;
  }

  //v2
//   export function createInfoInput(placeholder: string, name: string): HTMLInputElement {
//     const input = document.createElement("input");
//     input.type = "text";
//     input.name = name;
//     input.placeholder = placeholder;
  
//     input.className = `
//       w-full
//       px-4
//       py-2
//       mt-2
//       text-white
//       bg-gray-800
//       border
//       border-gray-700
//       rounded-lg
//       focus:outline-none
//       focus:ring-2
//       focus:ring-blue-500
//       dark:bg-white
//       dark:text-black
//     `.replace(/\s+/g, " ");
  
//     return input;
//   }
  