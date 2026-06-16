/**
 * Shared horizontal scroll math for measured-width swimlanes
 * ({@link MixedWidthSwimlane}, {@link VariableSwimlane}).
 */

/** @param {readonly number[]} widths */
export function sumSlotWidthsBeforeIndex(widths, gap, index) {
  let sum = 0;
  for (let i = 0; i < index; i += 1) {
    sum += (widths[i] ?? 0) + gap;
  }
  return sum;
}

/**
 * Leading-edge park with trailing-slot flush (last index fully visible).
 *
 * @param {{
 *   index: number,
 *   slotWidths: readonly number[],
 *   gap: number,
 *   viewportWidth: number,
 *   gutterStart: number,
 *   gutterEnd: number,
 * }} params
 */
export function calcMeasuredSwimlaneOffset({
  index,
  slotWidths,
  gap,
  viewportWidth,
  gutterStart,
  gutterEnd,
}) {
  if (viewportWidth <= 0 || slotWidths.length === 0) return 0;

  const totalContentWidth =
    slotWidths.reduce((sum, width) => sum + width, 0) +
    Math.max(0, slotWidths.length - 1) * gap;

  const focusLeft = sumSlotWidthsBeforeIndex(slotWidths, gap, index);
  const focusWidth = slotWidths[index] ?? 0;
  const lastIndex = slotWidths.length - 1;

  const maxOffset = Math.max(
    0,
    totalContentWidth - viewportWidth + gutterStart + gutterEnd,
  );

  let offset = focusLeft;

  if (index === lastIndex) {
    const offsetForFullLast =
      focusLeft + focusWidth - (viewportWidth - gutterEnd - gutterStart);
    offset = Math.max(offset, offsetForFullLast);
  }

  return Math.min(Math.max(0, offset), maxOffset);
}
