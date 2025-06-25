 /** @type {import('tailwindcss').Config} */
 import animations from '@midudev/tailwind-animations'

 export default {
  darkMode: "class",
  content: ["./srcs/**/*.{html,ts,js}", "./public/**/*.{html,ts,js}"],
  theme: {
    extend: {
			keyframes: {
				"spin": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				}
			},
			animation: {
				"spin": "spin 1s linear infinite"
			},
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
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
		animations
  ],
}
