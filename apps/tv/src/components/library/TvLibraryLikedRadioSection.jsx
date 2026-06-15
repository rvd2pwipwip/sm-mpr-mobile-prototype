import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getRadioStationById } from "@sm-mpr/shared/data/radioStations.js";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import { myLibraryLikesMorePath } from "@sm-mpr/shared/constants/myLibraryLikes.js";
import { useLikes } from "../../context/LikesContext.jsx";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import "../cards/ContentTileCard.css";

/** Your radio stations — liked stations only; hidden when empty. */
export default function TvLibraryLikedRadioSection({
  groupIndex,
  focused,
  focusedIndex,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const navigate = useNavigate();
  const { items } = useLikes();

  const stations = useMemo(() => {
    const out = [];
    for (const entry of items) {
      if (entry.kind !== "radio") continue;
      const station =
        getRadioStationById(entry.id) ?? resolveRadioStationForStub(entry.id);
      if (station) {
        out.push({
          id: station.id,
          thumbnail: station.thumbnail,
          title: station.name,
        });
      }
    }
    return out;
  }, [items]);

  if (stations.length === 0) return null;

  return (
    <ContentTileSwimlane
      title="Your radio stations"
      items={stations}
      sourceCount={stations.length}
      groupIndex={groupIndex}
      focused={focused}
      focusedIndex={focusedIndex}
      onFocusChange={onFocusChange}
      onBoundaryLeft={onBoundaryLeft}
      registerItemRef={registerItemRef}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onMore={() => navigate(myLibraryLikesMorePath("radio"))}
      onSelectItem={(station) => navigate(`/radio/${station.id}`)}
    />
  );
}
