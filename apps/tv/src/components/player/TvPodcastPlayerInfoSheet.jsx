import { useCallback, useEffect, useMemo, useState } from "react";
import { getPodcastById } from "@sm-mpr/shared/data/podcasts.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
  userMaySubscribePodcasts,
} from "@sm-mpr/shared/utils/userContentGates.js";
import ChannelInfoDescription from "../channel-info/ChannelInfoDescription.jsx";
import ChannelInfoDescriptionDialog from "../channel-info/ChannelInfoDescriptionDialog.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeListItem from "../podcasts/TvEpisodeListItem.jsx";
import TvButton from "../TvButton.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../../constants/homeFocusGroups.js";
import { useAccountRequiredDialog } from "../../context/AccountRequiredDialogContext.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import { useDescriptionClampOverflow } from "../../hooks/useDescriptionClampOverflow.js";
import { useScreenContentFocus } from "../../hooks/useScreenContentFocus.js";
import { useTvPlayerInfoSheetSession } from "../../hooks/useTvPlayerInfoSheetSession.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import TvPlayerInfoBottomSheet from "./TvPlayerInfoBottomSheet.jsx";
import "../../pages/PodcastInfo.css";

const ACTIONS_GROUP = 0;
const PLAY_ACTION = 0;
const SUBSCRIBE_ACTION = 1;
const EPISODE_SLOTS = 3;

function TvPodcastPlayerInfoSheetBody({
  open,
  podcast,
  currentEpisodeId,
  playing,
  onTogglePlay,
  onSelectEpisode,
  onClose,
  descriptionDialogOpen,
  setDescriptionDialogOpen,
}) {
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

  const {
    toggleSubscribe,
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isSubscribed,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const descriptionText = podcast.description ?? "";
  const hasDescription = Boolean(descriptionText);
  const { ref: descriptionRef, overflows: descriptionOverflows } =
    useDescriptionClampOverflow(descriptionText, hasDescription, open);

  const episodeCount = podcast.episodes.length;

  const { descriptionGroup, episodeGroups, groupCount, itemCounts } =
    useMemo(() => {
      let next = 1;
      const counts = { [ACTIONS_GROUP]: 2 };
      const descG =
        hasDescription && descriptionOverflows ? next++ : null;
      if (descG != null) counts[descG] = 1;
      const epGroups = [];
      for (let i = 0; i < episodeCount; i += 1) {
        const g = next++;
        counts[g] = EPISODE_SLOTS;
        epGroups.push(g);
      }
      return {
        descriptionGroup: descG,
        episodeGroups: epGroups,
        groupCount: Math.max(next, 1),
        itemCounts: counts,
      };
    }, [hasDescription, descriptionOverflows, episodeCount]);

  const focusScreenId = `podcast-player-info-sheet-${podcast.id}`;
  const scrollScreenId = `podcast-player-info-sheet-scroll-${podcast.id}`;

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    getItemFocusIndex,
    focusedGroupIndex,
    getItemElement,
    syncDomFocus,
  } = useScreenContentFocus(focusScreenId, {
    groupCount,
    itemCounts,
    swimlaneGroups: [],
    defaultGroupIndex: ACTIONS_GROUP,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
    navEnterEnabled: false,
    contentKeysEnabled: !descriptionDialogOpen,
    suspendDomFocus: descriptionDialogOpen,
  });

  const firstEpisodeGroup = episodeGroups[0] ?? null;
  const actionsDownTarget = descriptionGroup ?? firstEpisodeGroup;

  const getFocusedElement = useCallback(
    () => {
      const itemIndex =
        getItemFocusIndex(focusedGroupIndex) ?? HOME_LANDING_ITEM_INDEX;
      return getItemElement(focusedGroupIndex, itemIndex);
    },
    [focusedGroupIndex, getItemElement, getItemFocusIndex],
  );

  const lastFocusableGroup = groupCount > 0 ? groupCount - 1 : 0;

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: ACTIONS_GROUP,
    firstFocusableGroupIndex: ACTIONS_GROUP,
    lastFocusableGroupIndex: lastFocusableGroup,
    getFocusedElement,
    screenId: scrollScreenId,
    scrollEnabled: groupCount > 0,
  });

  useEffect(() => {
    if (descriptionDialogOpen) return;
    syncDomFocus();
  }, [descriptionDialogOpen, descriptionOverflows, syncDomFocus]);

  const subscribedHere = isSubscribed(podcast.id);
  const titleId = `tv-podcast-player-info-sheet-title-${podcast.id}`;

  const onSubscribePress = () => {
    if (!subscribedHere && !userMaySubscribePodcasts(userType)) {
      openAccountRequiredDialog("podcastSubscribe");
      return;
    }
    toggleSubscribe(podcast.id);
  };

  const switchEpisode = (episodeId) => {
    if (episodeId === currentEpisodeId) {
      onClose();
      return;
    }
    onClose();
    onSelectEpisode(episodeId);
  };

  return (
    <>
      <div ref={viewportRef} className="tv-player-info-sheet__scroll">
        <div
          ref={innerRef}
          className={[
            "tv-player-info-sheet__content",
            "tv-podcast-info__sheet-inner",
            innerClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          <section className="tv-podcast-info__hero">
            <div className="tv-podcast-info__hero-row">
              <img
                className="tv-podcast-info__art"
                src={podcast.thumbnail}
                alt=""
                width={400}
                height={400}
              />
              <div className="tv-podcast-info__hero-copy">
                <h2
                  id={titleId}
                  className="tv-podcast-info__title tv-screen-header-title"
                >
                  {podcast.title}
                </h2>

                <div
                  className="tv-home__scroll-group"
                  ref={(el) => registerGroupRef(ACTIONS_GROUP, el)}
                >
                  <div className="tv-podcast-info__actions-row">
                    <KeyboardWrapper
                      ref={(node) =>
                        registerItemRef(ACTIONS_GROUP, PLAY_ACTION, node)
                      }
                      onSelect={onTogglePlay}
                      onUp={handleMoveUp}
                      onDown={
                        actionsDownTarget != null ? handleMoveDown : undefined
                      }
                      onLeft={handleMoveLeft}
                      onRight={handleMoveRight}
                    >
                      {(focusProps) => (
                        <TvButton
                          {...focusProps}
                          focused={isItemFocused(ACTIONS_GROUP, PLAY_ACTION)}
                          iconMaskVariant={playing ? "pause" : "play"}
                          label={playing ? "Pause" : "Play"}
                        />
                      )}
                    </KeyboardWrapper>

                    <KeyboardWrapper
                      ref={(node) =>
                        registerItemRef(ACTIONS_GROUP, SUBSCRIBE_ACTION, node)
                      }
                      onSelect={onSubscribePress}
                      onUp={handleMoveUp}
                      onDown={
                        actionsDownTarget != null ? handleMoveDown : undefined
                      }
                      onLeft={handleMoveLeft}
                      onRight={handleMoveRight}
                    >
                      {(focusProps) => (
                        <TvButton
                          {...focusProps}
                          variant="secondary"
                          focused={isItemFocused(
                            ACTIONS_GROUP,
                            SUBSCRIBE_ACTION,
                          )}
                          iconSrc={
                            subscribedHere
                              ? "/unsubscribePodcast.svg"
                              : "/subscribePodcast.svg"
                          }
                          label={subscribedHere ? "Unsubscribe" : "Subscribe"}
                        />
                      )}
                    </KeyboardWrapper>
                  </div>
                </div>

                {hasDescription && descriptionGroup != null ? (
                  <div
                    className="tv-home__scroll-group"
                    ref={(el) => registerGroupRef(descriptionGroup, el)}
                  >
                    <ChannelInfoDescription
                      text={descriptionText}
                      descriptionRef={descriptionRef}
                      overflows={descriptionOverflows}
                      groupIndex={descriptionGroup}
                      focused={isItemFocused(descriptionGroup, 0)}
                      registerItemRef={registerItemRef}
                      onMoveUp={handleMoveUp}
                      onMoveDown={
                        firstEpisodeGroup != null ? handleMoveDown : undefined
                      }
                      onSelect={() => setDescriptionDialogOpen(true)}
                    />
                  </div>
                ) : hasDescription ? (
                  <p
                    ref={descriptionRef}
                    className="channel-info-description__text channel-info-description__text--clamped tv-podcast-info__description-static"
                  >
                    {descriptionText}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {episodeGroups.length > 0 ? (
            <section
              className="tv-podcast-info__episodes"
              aria-labelledby="tv-podcast-player-info-sheet-episodes-heading"
            >
              <h3
                id="tv-podcast-player-info-sheet-episodes-heading"
                className="tv-podcast-info__episodes-heading"
              >
                Episodes
              </h3>
              <div className="tv-podcast-info__episodes-list">
                {podcast.episodes.map((episode, index) => {
                  const groupIndex = episodeGroups[index];
                  return (
                    <div
                      key={episode.id}
                      className="tv-home__scroll-group"
                      ref={(el) => registerGroupRef(groupIndex, el)}
                    >
                      <TvEpisodeListItem
                        episode={episode}
                        progressFraction={getEpisodeProgress(episode.id)}
                        isBookmarked={isBookmarked(episode.id)}
                        isDownloaded={isDownloaded(episode.id)}
                        groupIndex={groupIndex}
                        focusedIndex={getItemFocusIndex(groupIndex)}
                        focused={focusedGroupIndex === groupIndex}
                        registerItemRef={registerItemRef}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onMoveLeft={handleMoveLeft}
                        onMoveRight={handleMoveRight}
                        onPlay={() => switchEpisode(episode.id)}
                        onToggleBookmark={() => {
                          if (
                            !isBookmarked(episode.id) &&
                            !userMayBookmarkEpisodes(userType)
                          ) {
                            openAccountRequiredDialog("episodeBookmark");
                            return;
                          }
                          toggleBookmark(episode.id);
                        }}
                        onToggleDownload={() => {
                          if (
                            !isDownloaded(episode.id) &&
                            !userMayDownloadEpisodesOffline(userType)
                          ) {
                            openAccountRequiredDialog("episodeOfflineDownload");
                            return;
                          }
                          toggleDownload(episode.id);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <ChannelInfoDescriptionDialog
        open={descriptionDialogOpen}
        channelName={podcast.title}
        description={descriptionText}
        onClose={() => setDescriptionDialogOpen(false)}
      />
    </>
  );
}

/**
 * Podcast show info inside the player bottom sheet — episode rows switch the
 * active `/play/:episodeId` route; other navigation exits the player.
 */
export default function TvPodcastPlayerInfoSheet({
  open,
  onClose,
  podcastId,
  currentEpisodeId,
  playing,
  onTogglePlay,
  onSelectEpisode,
}) {
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const podcast = podcastId ? getPodcastById(podcastId) : null;

  const focusScreenId = podcast
    ? `podcast-player-info-sheet-${podcast.id}`
    : "podcast-player-info-sheet";
  const scrollScreenId = podcast
    ? `podcast-player-info-sheet-scroll-${podcast.id}`
    : "podcast-player-info-sheet-scroll";

  const { contentKey } = useTvPlayerInfoSheetSession({
    open,
    focusScreenId,
    scrollScreenId,
    landingGroupIndex: ACTIONS_GROUP,
    landingItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  useEffect(() => {
    if (open) return;
    setDescriptionDialogOpen(false);
  }, [open]);

  if (!podcast) return null;

  const titleId = `tv-podcast-player-info-sheet-title-${podcast.id}`;

  return (
    <TvPlayerInfoBottomSheet
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <TvPodcastPlayerInfoSheetBody
        key={contentKey}
        open={open}
        podcast={podcast}
        currentEpisodeId={currentEpisodeId}
        playing={playing}
        onTogglePlay={onTogglePlay}
        onSelectEpisode={onSelectEpisode}
        onClose={onClose}
        descriptionDialogOpen={descriptionDialogOpen}
        setDescriptionDialogOpen={setDescriptionDialogOpen}
      />
    </TvPlayerInfoBottomSheet>
  );
}
