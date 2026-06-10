import "./TvOnScreenKeyboardStub.css";

const STUB_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

/**
 * Prototype stand-in for the OS on-screen keyboard overlay.
 * Non-interactive — PC keyboard drives the search field. Dismiss with Enter or Esc.
 */
export default function TvOnScreenKeyboardStub({ visible }) {
  if (!visible) return null;

  return (
    <div
      className="tv-os-keyboard-stub"
      role="presentation"
      aria-hidden={!visible}
    >
      <p className="tv-os-keyboard-stub__hint">
        OS keyboard (prototype) — type on your keyboard. Press Enter or Esc to
        dismiss.
      </p>
      <div className="tv-os-keyboard-stub__panel" aria-hidden="true">
        {STUB_ROWS.map((row) => (
          <div key={row.join("")} className="tv-os-keyboard-stub__row">
            {row.map((key) => (
              <span key={key} className="tv-os-keyboard-stub__key">
                {key}
              </span>
            ))}
          </div>
        ))}
        <div className="tv-os-keyboard-stub__row tv-os-keyboard-stub__row--space">
          <span className="tv-os-keyboard-stub__key tv-os-keyboard-stub__key--space">
            space
          </span>
        </div>
      </div>
    </div>
  );
}
