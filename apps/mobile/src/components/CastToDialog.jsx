import "./CastVideoScreenIcon.css";
import "./CastToDialog.css";
import { CAST_TO_TITLE } from "../constants/castPrototypeCopy";

/**
 * Cast device list — Figma `castPopup` `7511:78524`; not the same layout as `AppStackedDialog`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose — scrim / dismiss
 * @param {Array<{ id: string, name: string }>} props.devices
 * @param {(name: string) => void} props.onSelectDevice
 */
export default function CastToDialog({ open, onClose, devices, onSelectDevice }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="cast-to-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cast-to-dialog-title"
    >
      <button
        type="button"
        className="cast-to-dialog__scrim"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="cast-to-dialog__panel">
        <h2
          className="cast-to-dialog__header-row"
          id="cast-to-dialog-title"
        >
          {CAST_TO_TITLE}
        </h2>
        <ul className="cast-to-dialog__list">
          {devices.map((d) => (
            <li key={d.id} className="cast-to-dialog__item">
              <button
                type="button"
                className="cast-to-dialog__device-btn"
                onClick={() => onSelectDevice(d.name)}
              >
                <span
                  className="cast-video-screen-icon"
                  aria-hidden={true}
                />
                <span className="cast-to-dialog__device-label">{d.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
