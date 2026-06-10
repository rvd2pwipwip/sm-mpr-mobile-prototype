import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import {
  getMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";
import {
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import {
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import TvSwimlaneBannerAd from "../ads/TvSwimlaneBannerAd.jsx";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import { buildLimitedHomeStackedLanes } from "../../utils/limitedHomeStackedLanes.js";
import { HOME_FIRST_SWIMLANE_GROUP } from "../../constants/homeFocusGroups.js";

const MID_STACK_AD_AFTER_LANE_INDEX = 1;

/**
 * Layout B — stacked taxonomy swimlanes (mobile LimitedBrowse parity).
 */
export default function LimitedHomeStackedBody({
  activeBrowseTab,
  showMidStackAd,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  laneGroupOffset = HOME_FIRST_SWIMLANE_GROUP,
}) {
  const navigate = useNavigate();

  const lanes = useMemo(
    () => buildLimitedHomeStackedLanes(activeBrowseTab),
    [activeBrowseTab],
  );

  if (lanes.length === 0) {
    return (
      <div className="tv-home__scroll-group tv-home__content-inset">
        <p className="tv-home__catalog-proof">No browse lanes for this tab.</p>
      </div>
    );
  }

  return (
    <>
      {lanes.map((lane, laneIndex) => {
        const groupIndex = laneGroupOffset + laneIndex;

        return (
          <div key={lane.id}>
            <div
              className="tv-home__scroll-group"
              ref={(node) => registerGroupRef(groupIndex, node)}
            >
              {lane.type === CONTENT_TYPE.music ? (
                <MusicChannelSwimlane
                  title={lane.title}
                  channels={getMusicChannelsByCategory(lane.categoryId)}
                  sourceCount={lane.sourceCount}
                  groupIndex={groupIndex}
                  focused={isContentGroupActive(groupIndex)}
                  focusedIndex={getItemFocusIndex(groupIndex)}
                  onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
                  onBoundaryLeft={enterNavFromContent}
                  registerItemRef={registerItemRef}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onSelectChannel={(channel) =>
                    navigate(`/music/${channel.id}`)
                  }
                  onMore={() =>
                    navigate(`/more/music/${lane.categoryId}`)
                  }
                />
              ) : (
                <ContentTileSwimlane
                  title={lane.title}
                  items={
                    lane.type === CONTENT_TYPE.podcasts
                      ? getPodcastsByCategory(lane.categoryId).map((p) => ({
                          id: p.id,
                          thumbnail: p.thumbnail,
                          title: p.title,
                        }))
                      : getRadioStationsByCategory(lane.categoryId).map((s) => ({
                          id: s.id,
                          thumbnail: s.thumbnail,
                          title: s.name,
                        }))
                  }
                  sourceCount={lane.sourceCount}
                  groupIndex={groupIndex}
                  focused={isContentGroupActive(groupIndex)}
                  focusedIndex={getItemFocusIndex(groupIndex)}
                  onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
                  onBoundaryLeft={enterNavFromContent}
                  registerItemRef={registerItemRef}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onSelectItem={(item) => {
                    if (lane.type === CONTENT_TYPE.podcasts) {
                      navigate(`/podcast/${item.id}`);
                      return;
                    }
                    navigate(`/radio/${item.id}`);
                  }}
                  onMore={() => {
                    if (lane.type === CONTENT_TYPE.podcasts) {
                      navigate(
                        `/search/browse/podcasts/category/${lane.categoryId}`,
                      );
                      return;
                    }
                    navigate(
                      `/search/browse/radio/category/${lane.categoryId}`,
                    );
                  }}
                />
              )}
            </div>

            {showMidStackAd &&
            laneIndex === MID_STACK_AD_AFTER_LANE_INDEX ? (
              <div className="tv-home__scroll-group tv-home__content-inset">
                <TvSwimlaneBannerAd />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
