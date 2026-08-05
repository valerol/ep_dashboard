import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const homepage = fileURLToPath(new URL("./index.html", import.meta.url));

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
  },
  build: {
    rollupOptions: {
      input: homepage,
    },
  },
});
