/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'

export default {
  darkMode: "class",
  content: ["./srcs/**/*.{html,ts,js}", "./public/**/*.{html,ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        background: "#E5E7EB",
        background_dark: "#070F2B",
        navbar: "#E5E7EB",
        navbar_dark: "#070F2B",
        panel: "#FFFFFF",
        panel_dark: "#535C91",
      },
      backgroundImage: {
        primary: "linear-gradient(to right, #34D399, #22D3EE)",
        primary_dark: "linear-gradient(to right, #1B1A55, #9290C3)"
      },
      animation: {
        moveVertical: 'moveVertical 30s ease infinite',
        spin: 'spin 20s linear infinite',
      },
      keyframes: {
        moveInCircle: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        moveVertical: {
          '0%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        moveHorizontal: {
          '0%': { transform: 'translateX(-50%) translateY(-10%)' },
          '50%': { transform: 'translateX(50%) translateY(10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
        },
      },
      animation: {
        // 'vitesse_animation_nom_unique': 'nom_keyframe durée_séquence_animation fonction_lissage répétition'
        'blob-circle-fast': 'moveInCircle 20s reverse infinite', // g2, g5 utilise 20s
        'blob-vertical-medium': 'moveVertical 30s ease infinite', // g1 utilise 30s
        'blob-circle-slow': 'moveInCircle 40s linear infinite',    // g3 utilise 40s
        'blob-horizontal-medium': 'moveHorizontal 40s ease infinite', // g4 utilise 40s
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    animations
  ],
};
