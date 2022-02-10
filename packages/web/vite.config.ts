import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    brotliSize: false,
    assetsInlineLimit: 0,
  },
});
