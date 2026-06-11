import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MUSIC_LINEUP } from "@sm-mpr/shared/constants/musicLineup.js";
import TvSearchLabelTileSwimlane from "./TvSearchLabelTileSwimlane.jsx";
import TvSearchMusicVibeSection from "./TvSearchMusicVibeSection.jsx";
import "./TvSearchMusicBrowseBody.css";

/**
 * Music tab browse body — broad vibe stacks or limited genre tile row.
 */
export default function TvSearchMusicBrowseBody({
  musicLineupMode,
  browseLayout,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onPillChange,
}) {
  const navigate = useNavigate();

  const wrapGroup = useCallback(
    (groupIndex, node) => {
      registerGroupRef?.(groupIndex, node);
    },
    [registerGroupRef],
  );

  if (musicLineupMode === MUSIC_LINEUP.limited && browseLayout.limitedGenres) {
    const groupIndex = browseLayout.firstBodyGroup;
    const genres = browseLayout.limitedGenres;
    const tiles = genres.map((genre) => ({
      slug: genre.id,
      label: genre.label,
    }));

    return (
      <div className="tv-search-music-browse">
        <h2 className="tv-search-music-browse__title">Browse by genre</h2>
        <div
          className="tv-home__scroll-group tv-search-music-browse__group"
          ref={(node) => wrapGroup(groupIndex, node)}
        >
          <TvSearchLabelTileSwimlane
            tiles={tiles}
            groupIndex={groupIndex}
            focused={isContentGroupActive(groupIndex)}
            focusedIndex={getItemFocusIndex(groupIndex)}
            onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
            onSelectTile={(tile) =>
              navigate(`/search/browse/music/category/${tile.slug}`)
            }
            onBoundaryLeft={enterNavFromContent}
            registerItemRef={registerItemRef}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            ariaLabel="Music genres"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="tv-search-music-browse">
      {browseLayout.vibeSections.map((section) => (
        <div key={section.vibeId} className="tv-search-music-browse__group">
          <TvSearchMusicVibeSection
            vibeId={section.vibeId}
            title={section.title}
            memoryKey={section.memoryKey}
            preferredSlug={section.preferredSlug}
            pillsGroup={section.pillsGroup}
            cardsGroup={section.cardsGroup}
            registerGroupRef={wrapGroup}
            registerItemRef={registerItemRef}
            isContentGroupActive={isContentGroupActive}
            getItemFocusIndex={getItemFocusIndex}
            setFocusedIndex={setFocusedIndex}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            enterNavFromContent={enterNavFromContent}
            onPillChange={onPillChange}
          />
        </div>
      ))}
    </div>
  );
}
