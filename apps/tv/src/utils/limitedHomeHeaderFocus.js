/**
 * Focus slot order for limited Home header (left-to-right D-pad indices).
 * @param {{ id: string }[]} browseTabs
 * @param {boolean} showContentSwitcher
 * @param {boolean} showUpgrade
 * @param {boolean} [includeMiniPlayer]
 * @param {{ stacked?: boolean }} [options]
 */
export function buildLimitedHomeHeaderFocusSlots(
  browseTabs,
  showContentSwitcher,
  showUpgrade,
  includeMiniPlayer = false,
  { stacked = false } = {},
) {
  /** @type {Array<{ kind: 'tab' | 'upgrade' | 'miniPlayer' | 'info' | 'search', tabId?: string }>} */
  const slots = [];

  if (stacked) {
    slots.push({ kind: "info" }, { kind: "search" });

    if (showUpgrade) {
      slots.push({ kind: "upgrade" });
    }

    if (showContentSwitcher) {
      browseTabs.forEach((tab) => {
        slots.push({ kind: "tab", tabId: tab.id });
      });
    }

    if (includeMiniPlayer) {
      slots.push({ kind: "miniPlayer" });
    }

    return slots;
  }

  if (showContentSwitcher) {
    browseTabs.forEach((tab) => {
      slots.push({ kind: "tab", tabId: tab.id });
    });
  }

  if (showUpgrade) {
    slots.push({ kind: "upgrade" });
  }

  if (includeMiniPlayer) {
    slots.push({ kind: "miniPlayer" });
  }

  slots.push({ kind: "info" }, { kind: "search" });

  return slots;
}

/** @param {ReturnType<typeof buildLimitedHomeHeaderFocusSlots>} slots */
export function getLimitedHomeMiniPlayerSlotIndex(slots) {
  return slots.findIndex((s) => s.kind === "miniPlayer");
}

export function limitedHomeHeaderItemCount(slots) {
  return Math.max(slots.length, 1);
}
