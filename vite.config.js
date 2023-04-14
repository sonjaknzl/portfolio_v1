import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        imprint: resolve(__dirname, "imprint.html"),
        privacy: resolve(__dirname, "privacy.html"),
        CV: resolve(__dirname, "SonjaKuenzlCV.pdf"),
        plantify: resolve(__dirname, "plantify.pdf"),
      },
    },
  },
});
