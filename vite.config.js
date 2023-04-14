import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      // Make sure to externalize Three.js dependencies
      external: ["three"],

      output: {
        // Provide global variables for Three.js dependencies
        globals: {
          three: "THREE",
        },
      },
    },
  },
});
