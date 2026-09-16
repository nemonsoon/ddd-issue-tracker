import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 5173,
		proxy: {
			// 開発中は API を Hono へ転送し、画面から見た配置を本番と同じにする。
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		// React のプラグインは経路のプラグインより後に置く
		viteReact(),
	],
});
