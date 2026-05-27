import { ProviderLogoPair } from "./HomeHeader";
import "./HomeHeader.css";

/** Free-provider tier: brand row below player controls and above fixed player ad strip. */
export default function PlayerProvidedBrandRow() {
  return (
    <div className="music-player__provided-brand-row" aria-hidden={true}>
      <ProviderLogoPair />
    </div>
  );
}
