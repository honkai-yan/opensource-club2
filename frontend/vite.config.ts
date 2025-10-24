import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sslPlugin from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sslPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      lodash: "lodash-es",
    },
  },
  server: {
    https: {},
    port: 5173,
    host: "0.0.0.0",
  },
});
