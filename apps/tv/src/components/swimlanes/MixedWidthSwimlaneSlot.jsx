/** Measured slot wrapper — keeps width observation out of parent render. */
export default function MixedWidthSwimlaneSlot({ measureRef, children }) {
  return (
    <div ref={measureRef} className="mixed-width-swimlane__slot">
      {children}
    </div>
  );
}
