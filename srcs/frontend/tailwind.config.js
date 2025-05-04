 /** @type {import('tailwindcss').Config} */
 export default {
  content: ["./srcs/**/*.{html,ts,js}", "./public/**/*.{html,ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        primary: "linear-gradient(to right, #34D399, #22D3EE)", // Emerald to Cyan gradient
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
		require('tailwindcss-animated')
  ],
}
