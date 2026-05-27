/**
 * Static mocks for dumb Web Share prototype (`SharePrototypeProvider`).
 */

export function vitePublicHref(relativePath) {
  const raw =
    typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const base = raw.endsWith("/") ? raw : `${raw}/`;
  const trimmed = relativePath.replace(/^\/+/, "");
  return `${base}${trimmed}`;
}

/** Share picker mock (`public/dialogShareAPI.png`). */
export const SHARE_PROTOTYPE_DIALOG_WEB_IMG =
  vitePublicHref("dialogShareAPI.png");

/** Facebook composer mock (`public/facebookShare.png`). */
export const SHARE_PROTOTYPE_FACEBOOK_IMG =
  vitePublicHref("facebookShare.png");
