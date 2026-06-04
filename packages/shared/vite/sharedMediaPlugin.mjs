import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MEDIA_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../media",
);

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

/**
 * Serve and copy `packages/shared/media` to `/media` (dev + production build).
 */
export function sharedMediaPlugin() {
  /** @type {string} */
  let buildOutDir = "";

  return {
    name: "sm-mpr-shared-media",
    configResolved(config) {
      buildOutDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/media/")) {
          next();
          return;
        }
        const rel = decodeURIComponent(req.url.split("?")[0].slice("/media/".length));
        const filePath = path.normalize(path.join(MEDIA_ROOT, rel));
        if (!filePath.startsWith(MEDIA_ROOT) || !fs.existsSync(filePath)) {
          next();
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
        fs.createReadStream(filePath).pipe(res);
      });
    },
    closeBundle() {
      if (!buildOutDir) return;
      copyDirSync(MEDIA_ROOT, path.join(buildOutDir, "media"));
    },
  };
}
