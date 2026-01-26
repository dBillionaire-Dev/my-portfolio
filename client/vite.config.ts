
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("VITE CONFIG LOADED FROM CLIENT FOLDER");

export default defineConfig({
  // Since this file is in /client, the root is this directory
  root: __dirname,

  plugins: [
    react(), 
    runtimeErrorOverlay() as any,
  ],

  resolve: {
    alias: {
      // Maps '@' to 'client/src'
      "@": path.resolve(__dirname, "src"),
      // Maps '@shared' to the 'shared' folder one level up
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },

  css: {
    postcss: {
      plugins: [
        // Ensures Tailwind scans the correct files relative to this config
        tailwindcss({ 
          config: path.resolve(__dirname, 'tailwind.config.ts') 
        }),
        autoprefixer(),
      ],
    },
  },

  build: {
    // Places the final build in the root's dist folder
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Optimized chunking to keep the initial load small
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          highlighter: ['react-syntax-highlighter'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },

  server: {
    fs: {
      // Allows Vite to serve files from the shared folder one level up
      allow: ['..'],
      strict: true,
      deny: ["**/.*"],
    },
  },
});