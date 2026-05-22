/**
 * Info / Settings section — prototype copy and segment ids.
 * Autoplay helper: Figma `5518:74294`; audio labels: `5689:80689`.
 */

/** Figma `5518:74294` — line under Autoplay title */
export const INFO_AUTOPLAY_DESCRIPTION =
  "Start playing music as soon as the app is launched";

export const AUDIO_QUALITY_SEGMENTS = Object.freeze([
  {
    id: "normal",
    label: "Normal",
    bitrate: "96 Kbps",
    consumption: "45 MB/hour",
    /** Renders trailing “(Recommended)” after tier name in copy. */
    recommendedParenthetical: true,
  },
  {
    id: "high",
    label: "High",
    bitrate: "160 Kbps",
    consumption: "75 MB/hour",
    recommendedParenthetical: false,
  },
  {
    id: "maximum",
    label: "Maximum",
    bitrate: "320 Kbps",
    consumption: "150 MB/hour",
    recommendedParenthetical: false,
  },
]);

/** Shown below the tier description whenever Audio Quality expanded (all tiers). */
export const AUDIO_QUALITY_DATA_CHARGES_NOTE =
  "Increasing the audio quality may result in additional data charges.";

/**
 * Communication preferences — Figma `5518:74308` (marketing preference center).
 */
export const COMMUNICATION_PREFERENCES_HREF =
  "https://marketing.stingray.com/preference-center?pc=e012135e89a2d8334194233535b55da0&lang=en";

/** Top audio quality upsell — Figma `9585:70503` */
export const AUDIO_QUALITY_UPSELL = {
  title: "Want Top Audio Quality?",
  body: "Go from 96 Kbps to 320 Kbps with a premium account.",
  primaryLabel: "Upgrade",
  secondaryLabel: "Log in",
};
