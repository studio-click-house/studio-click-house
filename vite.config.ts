import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, createLogger } from "vite";

const logger = createLogger();
const originalWarn = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes("node:dns/promises") && msg.includes("externalized for browser compatibility")) return;
  if (msg.includes("Circular dependency:")) return;
  originalWarn(msg, options);
};

export default defineConfig({
  customLogger: logger,
  plugins: [tailwindcss(), sveltekit()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["node:dns/promises"],
      onwarn(warning, defaultHandler) {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.message.includes("has been externalized for browser compatibility")) return;
        defaultHandler(warning);
      },
      output: {
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
