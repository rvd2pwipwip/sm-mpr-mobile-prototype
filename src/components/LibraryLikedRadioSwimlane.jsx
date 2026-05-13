import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import RadioStationCard from "./RadioStationCard";
import { myLibraryLikesMorePath } from "../constants/myLibraryLikes";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useLikes } from "../context/LikesContext";
import { getRadioStationById } from "../data/radioStations";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";

/** Your radio stations — liked stations only; hidden when empty (`My-Library-story`). */
export default function LibraryLikedRadioSwimlane() {
  const navigate = useNavigate();
  const { items } = useLikes();

  const stations = useMemo(() => {
    const out = [];
    for (const entry of items) {
      if (entry.kind !== "radio") continue;
      const byId = getRadioStationById(entry.id);
      const station = byId ?? resolveRadioStationForStub(entry.id);
      if (station) out.push(station);
    }
    return out;
  }, [items]);

  if (stations.length === 0) {
    return null;
  }

  return (
    <ContentSwimlane
      title="Your radio stations"
      sourceCount={stations.length}
      maxVisible={SWIMLANE_CARD_MAX}
      onMore={() => navigate(myLibraryLikesMorePath("radio"))}
    >
      {stations.slice(0, SWIMLANE_CARD_MAX).map((station) => (
        <RadioStationCard
          key={station.id}
          station={station}
          onSelect={() => navigate(`/radio/${station.id}`)}
        />
      ))}
    </ContentSwimlane>
  );
}
