/** Module bridge so GlobalTvKeys can dismiss screensaver before navigate(-1). */

/** @type {{ isActive: boolean; dismiss: (() => void) | null } | null} */
let escapeBridge = null;

/**
 * @param {{ isActive: boolean; dismiss: () => void }} bridge
 * @returns {() => void}
 */
export function registerTvPlayerScreensaverEscape(bridge) {
  escapeBridge = bridge;
  return () => {
    if (escapeBridge === bridge) {
      escapeBridge = null;
    }
  };
}

/** @returns {boolean} True when screensaver was dismissed. */
export function tryDismissTvPlayerScreensaver() {
  if (!escapeBridge?.isActive || !escapeBridge.dismiss) {
    return false;
  }
  escapeBridge.dismiss();
  return true;
}
