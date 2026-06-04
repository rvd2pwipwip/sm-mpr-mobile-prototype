import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sharedMediaPlugin } from "../../packages/shared/vite/sharedMediaPlugin.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sharedMediaPlugin()],
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
