import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";

/**
 * @typedef {{ thumbnail: string; line1: string; line2: string }} ScreensaverModel
 */

const FALLBACK_MODEL = {
  thumbnail: "/stingrayMusic.svg",
  line1: "Stingray Music",
  line2: "Music, podcasts, and radio",
};

/**
 * @param {import("../context/PlaybackContext.jsx").session | { active: boolean; variant?: string; thumbnail?: string; title?: string; subtitle?: string; channelId?: string | null; radioStationId?: string | null }} session
 * @returns {ScreensaverModel}
 */
export function buildScreensaverModel(session) {
  if (!session?.active) {
    return FALLBACK_MODEL;
  }

  if (session.variant === "music") {
    const channel = session.channelId
      ? getMusicChannelById(session.channelId)
      : null;
    return {
      thumbnail: session.thumbnail || channel?.thumbnail || "",
      line1: channel?.name || "Music",
      line2: session.title || "Song title (prototype)",
    };
  }

  if (session.variant === "podcasts") {
    return {
      thumbnail: session.thumbnail || "",
      line1: session.subtitle || "Podcast",
      line2: session.title || "Episode",
    };
  }

  if (session.variant === "radio") {
    const station = session.radioStationId
      ? resolveRadioStationForStub(session.radioStationId)
      : null;
    return {
      thumbnail: session.thumbnail || station?.thumbnail || "",
      line1: station?.name || session.title || "Radio",
      line2:
        session.subtitle ||
        station?.frequencyLabel ||
        station?.categoryLabel ||
        "Live",
    };
  }

  return {
    thumbnail: session.thumbnail || "",
    line1: session.subtitle || "Now playing",
    line2: session.title || FALLBACK_MODEL.line2,
  };
}
