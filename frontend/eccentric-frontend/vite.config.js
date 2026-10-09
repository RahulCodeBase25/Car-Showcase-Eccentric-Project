import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// In development, /api goes to the local backend. In production Vercel
// rewrites /api to the hosted API (see vercel.json).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api": "http://localhost:5000" } },
  preview: { proxy: { "/api": "http://localhost:5000" } },
});
