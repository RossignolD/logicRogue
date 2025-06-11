import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/game": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // If using self-signed certificates
      },
    },
  },
  plugins: [react()],
});
