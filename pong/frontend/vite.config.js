
import { defineConfig } from "vite";

export default defineConfig({
	root: "public",
	server: {
		host: true,
		watch: {
			usePolling: true
		},
		strictPort: true
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true
	}
});