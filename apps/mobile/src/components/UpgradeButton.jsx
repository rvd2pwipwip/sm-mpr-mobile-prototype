import Button from "./Button";

function UpgradeStartIcon() {
  return (
    <img
      className="btn__icon-asset"
      src="/upgrade.svg"
      alt=""
      width="30"
      height="30"
      decoding="async"
    />
  );
}

/**
 * Guest “Upgrade” CTA — same as `HomeHeader` (purple `cta` + `public/upgrade.svg`).
 * Reuse on music player and other full-screen players.
 */
export default function UpgradeButton({ onClick, className = "" }) {
  return (
    <Button variant="cta" onClick={onClick} startIcon={<UpgradeStartIcon />} className={className}>
      Upgrade
    </Button>
  );
}
