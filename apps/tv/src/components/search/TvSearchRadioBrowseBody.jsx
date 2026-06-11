import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRadioStationsByCategory } from "@sm-mpr/shared/data/radioStations.js";
import { RADIO_BROWSE_PATH } from "../../constants/radioBrowsePaths.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import TvSearchRadioInternationalSection from "./TvSearchRadioInternationalSection.jsx";
import "./TvSearchRadioBrowseBody.css";

function radioBrowseMorePath(categoryId) {
  if (categoryId === "near-you") return RADIO_BROWSE_PATH.nearYou;
  if (categoryId === "international") return RADIO_BROWSE_PATH.international;
  return RADIO_BROWSE_PATH.format(categoryId);
}

/**
 * Radio tab browse body — category swimlanes + International pills/tiles (mobile IA).
 */
export default function TvSearchRadioBrowseBody({
  browseLayout,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onInternationalContinentChange,
}) {
  const navigate = useNavigate();

  const wrapGroup = useCallback(
    (groupIndex, node) => {
      registerGroupRef?.(groupIndex, node);
    },
    [registerGroupRef],
  );

  return (
    <div className="tv-search-radio-browse">
      {browseLayout.sections.map((section) => {
        if (section.kind === "international") {
          return (
            <div
              key={section.categoryId}
              className="tv-search-radio-browse__group"
            >
              <TvSearchRadioInternationalSection
                title={section.label}
                memoryKey={section.memoryKey}
                pillsGroup={section.pillsGroup}
                cardsGroup={section.cardsGroup}
                registerGroupRef={registerGroupRef}
                registerItemRef={registerItemRef}
                isContentGroupActive={isContentGroupActive}
                getItemFocusIndex={getItemFocusIndex}
                setFocusedIndex={setFocusedIndex}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                enterNavFromContent={enterNavFromContent}
                onContinentChange={onInternationalContinentChange}
              />
            </div>
          );
        }

        const stations = getRadioStationsByCategory(section.categoryId);
        const items = stations.map((station) => ({
          id: station.id,
          thumbnail: station.thumbnail,
          title: station.name,
        }));

        return (
          <div
            key={section.categoryId}
            className="tv-home__scroll-group tv-search-radio-browse__group"
            ref={(node) => wrapGroup(section.groupIndex, node)}
          >
            <ContentTileSwimlane
              title={section.label}
              items={items}
              sourceCount={section.sourceCount}
              groupIndex={section.groupIndex}
              focused={isContentGroupActive(section.groupIndex)}
              focusedIndex={getItemFocusIndex(section.groupIndex)}
              onFocusChange={(index) =>
                setFocusedIndex(section.groupIndex, index)
              }
              onBoundaryLeft={enterNavFromContent}
              registerItemRef={registerItemRef}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onSelectItem={(item) => navigate(`/radio/${item.id}`)}
              onMore={() => navigate(radioBrowseMorePath(section.categoryId))}
            />
          </div>
        );
      })}
    </div>
  );
}
