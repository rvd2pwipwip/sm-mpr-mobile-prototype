import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getPodcastById } from "@sm-mpr/shared/data/podcasts.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
  userMaySubscribePodcasts,
} from "@sm-mpr/shared/utils/userContentGates.js";
import ChannelInfoDescription from "../components/channel-info/ChannelInfoDescription.jsx";
import ChannelInfoDescriptionDialog from "../components/channel-info/ChannelInfoDescriptionDialog.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvEpisodeListItem from "../components/podcasts/TvEpisodeListItem.jsx";
import TvButton from "../components/TvButton.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useDescriptionClampOverflow } from "../hooks/useDescriptionClampOverflow.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import "./PodcastInfo.css";

const ACTIONS_GROUP = 0;
const PLAY_ACTION = 0;
const SUBSCRIBE_ACTION = 1;
const EPISODE_SLOTS = 3;

/**
 * Podcast show detail — Figma `7551:27042`; episode rows `7545:22722`.
 */
export default function PodcastInfo() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const {
    toggleSubscribe,
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isSubscribed,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const podcast = podcastId ? getPodcastById(podcastId) : null;
  const descriptionText = podcast?.description ?? "";
  const hasDescription = Boolean(descriptionText);
  const { ref: descriptionRef, overflows: descriptionOverflows } =
    useDescriptionClampOverflow(descriptionText, hasDescription);

  const episodeCount = podcast?.episodes.length ?? 0;

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

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    getItemFocusIndex,
    enterNavFromContent,
    focusedGroupIndex,
    getItemElement,
  } = useScreenContentFocus(`podcast-info-${podcastId}`, {
    groupCount,
    itemCounts,
    swimlaneGroups: [],
    defaultGroupIndex: ACTIONS_GROUP,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
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
    screenId: `podcast-info-${podcastId}`,
    scrollEnabled: groupCount > 0,
  });

  if (!podcast) {
    return <Navigate to="/" replace />;
  }

  const subscribedHere = isSubscribed(podcast.id);
  const firstEpisode = podcast.episodes[0] ?? null;

  const onSubscribePress = () => {
    if (!subscribedHere && !userMaySubscribePodcasts(userType)) {
      openAccountRequiredDialog("podcastSubscribe");
      return;
    }
    toggleSubscribe(podcast.id);
  };

  const playEpisode = (episodeId) => {
    enterContent();
    navigate(`/podcast/${podcast.id}/play/${episodeId}`);
  };

  const playLatestEpisode = () => {
    if (firstEpisode) {
      playEpisode(firstEpisode.id);
    }
  };

  return (
    <div className="tv-podcast-info tv-screen-overlay">
      <div
        ref={viewportRef}
        className="tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
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
                <h1 className="tv-podcast-info__title tv-screen-header-title">
                  {podcast.title}
                </h1>

                <div
                  className="tv-home__scroll-group"
                  ref={(el) => registerGroupRef(ACTIONS_GROUP, el)}
                >
                  <div className="tv-podcast-info__actions-row">
                    <KeyboardWrapper
                      ref={(node) =>
                        registerItemRef(ACTIONS_GROUP, PLAY_ACTION, node)
                      }
                      onSelect={playLatestEpisode}
                      onUp={handleMoveUp}
                      onDown={
                        actionsDownTarget != null ? handleMoveDown : undefined
                      }
                      onLeft={enterNavFromContent}
                      onRight={handleMoveRight}
                    >
                      {(focusProps) => (
                        <TvButton
                          {...focusProps}
                          focused={isItemFocused(ACTIONS_GROUP, PLAY_ACTION)}
                          iconSrc="/play.svg"
                          label={
                            firstEpisode ? "Play latest" : "No episodes"
                          }
                          disabled={!firstEpisode}
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
              aria-labelledby="tv-podcast-info-episodes-heading"
            >
              <h2
                id="tv-podcast-info-episodes-heading"
                className="tv-podcast-info__episodes-heading"
              >
                Episodes
              </h2>
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
                        onPlay={() => playEpisode(episode.id)}
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

          <p className="tv-podcast-info__lede">Press Esc to go back.</p>
        </div>
      </div>

      <ChannelInfoDescriptionDialog
        open={descriptionDialogOpen}
        channelName={podcast.title}
        description={descriptionText}
        onClose={() => setDescriptionDialogOpen(false)}
      />
    </div>
  );
}
