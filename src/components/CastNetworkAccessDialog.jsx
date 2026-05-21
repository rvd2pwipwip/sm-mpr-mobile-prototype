import AppStackedDialog from "./AppStackedDialog";
import { NETWORK_ACCESS } from "../constants/castPrototypeCopy";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void} props.onOk
 * @param {() => void} props.onCancel
 */
export default function CastNetworkAccessDialog({ open, onClose, onOk, onCancel }) {
  return (
    <AppStackedDialog
      open={open}
      onClose={onClose}
      scrimCloseLabel="Close dialog"
      title={NETWORK_ACCESS.title}
      titleId="cast-network-access-title"
      descriptionId="cast-network-access-body"
      primaryButton={{
        label: NETWORK_ACCESS.ok,
        onClick: onOk,
        variant: "subscribe-primary",
      }}
      secondaryButton={{
        label: NETWORK_ACCESS.cancel,
        onClick: onCancel,
        appearance: "outline",
      }}
    >
      <p className="app-stacked-dialog__lede">
        <strong>{NETWORK_ACCESS.lead}</strong>
      </p>
      {NETWORK_ACCESS.body.map((line) => (
        <p key={line} className="app-stacked-dialog__lede app-stacked-dialog__lede--after">
          {line}
        </p>
      ))}
    </AppStackedDialog>
  );
}
