
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	root: "public",
	base: "./",
	server: {
		host: true,
		watch: {
			usePolling: true
		},
		strictPort: true
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		target: 'esnext'
	},
	resolve: {
		alias: {
			"/srcs": path.resolve(__dirname, "./srcs")
		}
	}
});