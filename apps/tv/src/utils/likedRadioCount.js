import { getRadioStationById } from "@sm-mpr/shared/data/radioStations.js";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";

export function getLikedRadioStations(likeItems) {
  const out = [];
  for (const entry of likeItems) {
    if (entry.kind !== "radio") continue;
    const station =
      getRadioStationById(entry.id) ?? resolveRadioStationForStub(entry.id);
    if (station) out.push(station);
  }
  return out;
}

/** 1 when at least one liked radio station resolves in catalog; else 0 (focus layout). */
export function likedRadioSwimlaneCount(likeItems) {
  return getLikedRadioStations(likeItems).length > 0 ? 1 : 0;
}
