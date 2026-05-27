import AppStackedDialog from "./AppStackedDialog";
import { RESTORE_PURCHASE_PROTOTYPE_DIALOG } from "../constants/infoAccount";

/**
 * Honest-copy stub for App / Play restore (Tier A): one `AppStackedDialog`, no storefront.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 */
export default function RestorePurchasePrototypeDialog({ open, onClose }) {
  const { title, primaryLabel, paragraphs } = RESTORE_PURCHASE_PROTOTYPE_DIALOG;

  return (
    <AppStackedDialog
      open={open}
      onClose={onClose}
      scrimCloseLabel="Close restore purchases explanation"
      title={title}
      titleId="restore-purchase-prototype-title"
      descriptionId="restore-purchase-prototype-body"
      primaryButton={{
        label: primaryLabel,
        onClick: onClose,
      }}
    >
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </AppStackedDialog>
  );
}
