import AppStackedDialog from "./AppStackedDialog";
import "./CastVideoScreenIcon.css";
import "./CastCastingOnDialog.css";
import { CASTING_ON } from "../constants/castPrototypeCopy";

/**
 * Summary while casting — Figma `19976:36417`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string | null} props.deviceName
 * @param {() => void} props.onOk
 * @param {() => void} props.onStopCasting
 */
export default function CastCastingOnDialog({
  open,
  onClose,
  deviceName,
  onOk,
  onStopCasting,
}) {
  return (
    <AppStackedDialog
      open={open}
      onClose={onClose}
      scrimCloseLabel="Close dialog"
      title={CASTING_ON.title}
      titleId="cast-casting-on-title"
      descriptionId="cast-casting-on-body"
      primaryButton={{
        label: CASTING_ON.ok,
        onClick: onOk,
        variant: "subscribe-primary",
      }}
      secondaryButton={{
        label: CASTING_ON.stopCasting,
        onClick: onStopCasting,
        appearance: "outline",
      }}
    >
      <div className="cast-casting-on-dialog__device-row">
        <span className="cast-video-screen-icon" aria-hidden={true} />
        <span className="cast-casting-on-dialog__device-name">
          {deviceName ?? ""}
        </span>
      </div>
    </AppStackedDialog>
  );
}
