import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    watch: {
      ignored: ["**/*.pdf"],
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["node:dns/promises"],
      output: {
        onlyExplicitManualChunks: true,
        manualChunks: (id) => {
          const normalizedId = id.replaceAll("\\", "/");
          if (!normalizedId.includes("/node_modules/")) return;

          if (
            normalizedId.includes("/three/build/three.webgpu.js") ||
            normalizedId.includes("/three/build/three.tsl.js")
          )
            return "vendor-three-webgpu";
          if (normalizedId.includes("/three-globe/"))
            return "vendor-three-globe";
          if (normalizedId.includes("/three/")) return "vendor-three-core";
          if (normalizedId.includes("/gsap/")) return "vendor-gsap";
        },
      },
    },
  },
});
