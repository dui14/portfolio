import path from "node:path";

import { build } from "vite";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const ENTRY = path.join(ROOT_DIR, "server", "vercel.ts");
const OUT_DIR = path.join(ROOT_DIR, "api");
const OUT_FILE = "contact.js";
const NODE_TARGET = "node20";

await build({
  root: ROOT_DIR,
  configFile: false,
  logLevel: "warn",
  publicDir: false,
  ssr: { noExternal: true },
  build: {
    ssr: ENTRY,
    outDir: OUT_DIR,
    emptyOutDir: false,
    target: NODE_TARGET,
    minify: false,
    sourcemap: false,
    copyPublicDir: false,
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: OUT_FILE,
        codeSplitting: false,
      },
    },
  },
});
