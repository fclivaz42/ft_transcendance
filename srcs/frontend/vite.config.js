
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	root: "public",
	base: "/",
	server: {
		host: true,
		watch: {
			usePolling: true
		},
		strictPort: true,
		proxy: {
			"/api": {
        target: 'https://127.0.0.1',
        changeOrigin: true,
        secure: false,
			}
		}
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
