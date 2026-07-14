import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages the site is served from /<repo-name>/. The deploy workflow
// passes BASE_PATH at build time; locally we default to "/".
//   BASE_PATH=/btsbot-embedding-atlas/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
  server: {
    // Honor a harness-assigned port when present; otherwise fall back and let
    // Vite pick the next free port rather than failing on a busy 5173.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
  },
  worker: {
    // Embedding Atlas ships web workers (search + clustering). Emit them as ES
    // modules so Vite bundles and references them from the same origin.
    format: "es",
  },
  optimizeDeps: {
    // embedding-atlas bundles its own workers (search/clustering) with
    // `new Worker(new URL(...))`. Vite's dep pre-bundler rewrites those URLs and
    // drops the worker files, leaving the embedding view blank. Excluding the
    // package keeps its worker references intact.
    exclude: ["embedding-atlas"],
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 4096,
  },
});
