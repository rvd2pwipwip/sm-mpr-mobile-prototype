import AppStackedDialog from "./AppStackedDialog";
import { LOCAL_NETWORK } from "../constants/castPrototypeCopy";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void} props.onOk
 * @param {() => void} props.onBlock
 */
export default function CastLocalNetworkDialog({ open, onClose, onOk, onBlock }) {
  return (
    <AppStackedDialog
      open={open}
      onClose={onClose}
      scrimCloseLabel="Close dialog"
      title={LOCAL_NETWORK.title}
      titleId="cast-local-network-title"
      descriptionId="cast-local-network-body"
      primaryButton={{
        label: LOCAL_NETWORK.ok,
        onClick: onOk,
        variant: "subscribe-primary",
      }}
      secondaryButton={{
        label: LOCAL_NETWORK.block,
        onClick: onBlock,
        appearance: "outline",
      }}
    >
      <p className="app-stacked-dialog__lede">
        <strong>{LOCAL_NETWORK.lead}</strong>
      </p>
      {LOCAL_NETWORK.body.map((line) => (
        <p key={line} className="app-stacked-dialog__lede app-stacked-dialog__lede--after">
          {line}
        </p>
      ))}
    </AppStackedDialog>
  );
}
