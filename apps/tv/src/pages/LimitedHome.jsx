import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { LISTEN_HISTORY_KIND_FOR_BROWSE_TAB } from "@sm-mpr/shared/constants/listenHistory.js";
import {
  getBrowseTabsForProfile,
  resolveLimitedBrowseTab,
  writeStoredLimitedBrowseTab,
} from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  showUpgradeCallToAction,
  showVisualAds,
} from "@sm-mpr/shared/utils/userTierRules.js";
import LimitedHomeFilterBody, {
  FILTERS_GROUP,
  SWIMLANE_GROUP,
} from "../components/limited/LimitedHomeFilterBody.jsx";
import LimitedHomeStackedBody from "../components/limited/LimitedHomeStackedBody.jsx";
import TvLimitedHomeHeaderSection from "../components/TvLimitedHomeHeaderSection.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useLimitedHomeEsc } from "../context/LimitedHomeEscContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { shouldShowTvMiniPlayer } from "../utils/playbackMiniPlayer.js";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import {
  LIMITED_HOME_LAYOUT,
  useLimitedHomeLayout,
} from "../constants/limitedHomeLayout.js";
import {
  HOME_BANNER_GROUP,
  HOME_FIRST_SWIMLANE_GROUP,
  HOME_HEADER_GROUP,
  HOME_LANDING_ITEM_INDEX,
} from "../constants/homeFocusGroups.js";
import {
  HOME_HEADER_LAYOUT,
  useHomeHeaderLayout,
} from "../constants/homeHeaderLayout.js";
import TvHomeBanner from "../components/TvHomeBanner.jsx";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useRestoreFocusAfterListenAgainClear } from "../hooks/useRestoreFocusAfterListenAgainClear.js";
import {
  getLimitedHomeChannels,
  getLimitedHomeFilterLabel,
  getLimitedHomeFilters,
} from "../utils/limitedHomeData.js";
import {
  buildLimitedHomeHeaderFocusSlots,
  getLimitedHomeMiniPlayerSlotIndex,
  limitedHomeHeaderItemCount,
} from "../utils/limitedHomeHeaderFocus.js";
import { buildLimitedHomeStackedLanes } from "../utils/limitedHomeStackedLanes.js";
import { buildTvPodcastLibraryRails } from "../utils/tvPodcastLibraryRails.js";
import {
  getListenAgainSwimlaneSlotCount,
  getMusicSwimlaneSlotCount,
} from "../utils/swimlaneUtils.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";

export default function LimitedHome() {
  const navigate = useNavigate();
  const layoutMode = useLimitedHomeLayout();
  const isStackedLayout = layoutMode === LIMITED_HOME_LAYOUT.stacked;

  const { userType } = useUserType();
  const showBannerAd = showVisualAds(userType);
  const { catalogScope, musicLineupMode } = useTerritory();
  const { session, miniPlayerVisible } = usePlayback();
  const { enterContent } = useTvNavFocus();
  const limitedHomeEsc = useLimitedHomeEsc();

  const {
    enabledContentTypes,
    shouldShowBrowseContentSwitcher,
    filterListenHistory,
  } = useContentProfile();

  const browseTabs = useMemo(
    () => getBrowseTabsForProfile(enabledContentTypes),
    [enabledContentTypes],
  );

  const [browseTab, setBrowseTab] = useState(() =>
    resolveLimitedBrowseTab(enabledContentTypes),
  );
  const [bannerVisible, setBannerVisible] = useState(true);

  const effectiveBrowseTab = useMemo(() => {
    if (!shouldShowBrowseContentSwitcher) {
      return browseTabs[0]?.id ?? CONTENT_TYPE.music;
    }
    return browseTabs.some((t) => t.id === browseTab)
      ? browseTab
      : (browseTabs[0]?.id ?? CONTENT_TYPE.music);
  }, [browseTabs, browseTab, shouldShowBrowseContentSwitcher]);

  useLayoutEffect(() => {
    const resolved = resolveLimitedBrowseTab(enabledContentTypes);
    if (browseTab !== resolved) {
      if (!browseTabs.some((t) => t.id === browseTab)) {
        setBrowseTab(resolved);
      }
    }
  }, [enabledContentTypes, browseTab, browseTabs]);

  useLayoutEffect(() => {
    writeStoredLimitedBrowseTab(effectiveBrowseTab);
  }, [effectiveBrowseTab]);

  const filters = useMemo(() => getLimitedHomeFilters(), []);
  const showUpgrade = showUpgradeCallToAction(userType);
  const showHeaderMini =
    isStackedLayout && shouldShowTvMiniPlayer(miniPlayerVisible, session);

  const headerFocusSlots = useMemo(
    () =>
      buildLimitedHomeHeaderFocusSlots(
        browseTabs,
        shouldShowBrowseContentSwitcher,
        showUpgrade,
        showHeaderMini,
        { stacked: isStackedLayout },
      ),
    [
      browseTabs,
      shouldShowBrowseContentSwitcher,
      showUpgrade,
      showHeaderMini,
      isStackedLayout,
    ],
  );

  const headerItemCount = limitedHomeHeaderItemCount(headerFocusSlots);
  const miniPlayerSlotIndex = getLimitedHomeMiniPlayerSlotIndex(
    headerFocusSlots,
  );

  const isMusicBrowse = effectiveBrowseTab === CONTENT_TYPE.music;

  const { memory, setField } = useScreenMemory("home-limited");
  const activeFilterId =
    memory.activeFilterId ?? filters[0]?.id ?? null;

  const channels = useMemo(
    () =>
      !isStackedLayout && isMusicBrowse
        ? getLimitedHomeChannels(activeFilterId)
        : [],
    [activeFilterId, isMusicBrowse, isStackedLayout],
  );

  const { items: listenHistoryItems } = useListenHistory();

  const tabListenItems = useMemo(() => {
    if (!isStackedLayout) return [];
    const kind = LISTEN_HISTORY_KIND_FOR_BROWSE_TAB[effectiveBrowseTab];
    if (!kind) return [];
    return filterListenHistory(listenHistoryItems).filter(
      (item) => item.kind === kind,
    );
  }, [
    isStackedLayout,
    effectiveBrowseTab,
    filterListenHistory,
    listenHistoryItems,
  ]);

  const listenAgainLaneCount =
    isStackedLayout && tabListenItems.length > 0 ? 1 : 0;

  const podcastUserState = usePodcastUserState();
  const podcastLibraryRails = useMemo(() => {
    if (!isStackedLayout || effectiveBrowseTab !== CONTENT_TYPE.podcasts) {
      return [];
    }
    return buildTvPodcastLibraryRails(podcastUserState);
  }, [
    isStackedLayout,
    effectiveBrowseTab,
    podcastUserState.subscribedPodcasts,
    podcastUserState.continueListening,
    podcastUserState.bookmarkedEpisodes,
    podcastUserState.newEpisodeRows,
    podcastUserState.downloadedEpisodes,
  ]);

  const stackedLanes = useMemo(
    () =>
      isStackedLayout
        ? buildLimitedHomeStackedLanes(effectiveBrowseTab)
        : [],
    [isStackedLayout, effectiveBrowseTab],
  );

  const stackedBodyLaneCount =
    listenAgainLaneCount + podcastLibraryRails.length + stackedLanes.length;

  const swimlaneSlotCount =
    !isStackedLayout && isMusicBrowse
      ? getMusicSwimlaneSlotCount(channels.length)
      : 0;

  const activeFilterIndex = filters.findIndex(
    (filter) => filter.id === activeFilterId,
  );

  const focusConfig = useMemo(() => {
    if (isStackedLayout) {
      const laneGroupOffset = HOME_FIRST_SWIMLANE_GROUP;
      const itemCounts = {
        [HOME_HEADER_GROUP]: headerItemCount,
        [HOME_BANNER_GROUP]: bannerVisible ? 1 : 0,
      };
      const swimlaneGroups = [];

      podcastLibraryRails.forEach((rail, index) => {
        const groupIndex = laneGroupOffset + listenAgainLaneCount + index;
        itemCounts[groupIndex] = rail.slotCount;
        swimlaneGroups.push(groupIndex);
      });

      if (listenAgainLaneCount > 0) {
        const groupIndex = laneGroupOffset;
        itemCounts[groupIndex] = getListenAgainSwimlaneSlotCount(
          tabListenItems.length,
        );
        swimlaneGroups.unshift(groupIndex);
      }

      stackedLanes.forEach((lane, index) => {
        const groupIndex =
          laneGroupOffset + listenAgainLaneCount + podcastLibraryRails.length + index;
        itemCounts[groupIndex] = lane.slotCount;
        swimlaneGroups.push(groupIndex);
      });

      const groupCount = Math.max(
        laneGroupOffset + stackedBodyLaneCount,
        HOME_BANNER_GROUP + 1,
      );

      const firstBodyGroup =
        stackedBodyLaneCount > 0
          ? laneGroupOffset
          : bannerVisible
            ? HOME_BANNER_GROUP
            : HOME_HEADER_GROUP;

      const lastBodyGroup =
        stackedBodyLaneCount > 0
          ? laneGroupOffset + stackedBodyLaneCount - 1
          : bannerVisible
            ? HOME_BANNER_GROUP
            : HOME_HEADER_GROUP;

      return {
        groupCount,
        itemCounts,
        swimlaneGroups,
        firstBodyGroup,
        lastBodyGroup,
        defaultGroupIndex: firstBodyGroup,
      };
    }

    const groupCount = isMusicBrowse ? 4 : 2;
    return {
      groupCount,
      itemCounts: {
        [HOME_HEADER_GROUP]: headerItemCount,
        [HOME_BANNER_GROUP]: bannerVisible ? 1 : 0,
        ...(isMusicBrowse
          ? {
              [FILTERS_GROUP]: filters.length,
              [SWIMLANE_GROUP]: swimlaneSlotCount,
            }
          : {}),
      },
      swimlaneGroups: isMusicBrowse ? [FILTERS_GROUP, SWIMLANE_GROUP] : [],
      firstBodyGroup: isMusicBrowse ? SWIMLANE_GROUP : HOME_BANNER_GROUP,
      lastBodyGroup: isMusicBrowse
        ? SWIMLANE_GROUP
        : bannerVisible
          ? HOME_BANNER_GROUP
          : HOME_HEADER_GROUP,
      defaultGroupIndex: isMusicBrowse ? SWIMLANE_GROUP : HOME_BANNER_GROUP,
    };
  }, [
    isStackedLayout,
    headerItemCount,
    bannerVisible,
    podcastLibraryRails,
    listenAgainLaneCount,
    tabListenItems.length,
    stackedLanes,
    stackedBodyLaneCount,
    isMusicBrowse,
    filters.length,
    swimlaneSlotCount,
  ]);

  /** Skip empty banner group (1) when promo is dismissed — window Up/Down use these resolvers. */
  const resolveMoveUp = useCallback(
    (current) => {
      if (bannerVisible) return null;

      if (current === HOME_BANNER_GROUP) {
        return HOME_HEADER_GROUP;
      }

      if (isStackedLayout) {
        if (current === HOME_FIRST_SWIMLANE_GROUP) {
          return HOME_HEADER_GROUP;
        }
        return null;
      }

      if (isMusicBrowse && current === FILTERS_GROUP) {
        return HOME_HEADER_GROUP;
      }

      return null;
    },
    [bannerVisible, isStackedLayout, isMusicBrowse],
  );

  const resolveMoveDown = useCallback(
    (current) => {
      if (bannerVisible) return null;

      if (current === HOME_HEADER_GROUP) {
        if (isStackedLayout && stackedBodyLaneCount > 0) {
          return HOME_FIRST_SWIMLANE_GROUP;
        }
        if (!isStackedLayout && isMusicBrowse) {
          return FILTERS_GROUP;
        }
      }

      return null;
    },
    [bannerVisible, isStackedLayout, stackedBodyLaneCount, isMusicBrowse],
  );

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    setFocusedGroupIndex,
    focusedGroupIndex,
    focusedIndex,
    getItemElement,
    enterNavFromContent,
  } = useScreenContentFocus("home-limited", {
    groupCount: focusConfig.groupCount,
    itemCounts: focusConfig.itemCounts,
    swimlaneGroups: focusConfig.swimlaneGroups,
    defaultGroupIndex: focusConfig.defaultGroupIndex,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
    navEnterEnabled: false,
    resolveMoveUp,
    resolveMoveDown,
  });

  const onListenAgainCleared = useRestoreFocusAfterListenAgainClear({
    showListenAgain: listenAgainLaneCount > 0,
    targetGroupIndex: focusConfig.firstBodyGroup,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
  });

  const onEpisodeRailCleared = useCallback(
    (groupIndex) => {
      setFocusedIndex(groupIndex, HOME_LANDING_ITEM_INDEX);
      requestAnimationFrame(() => {
        getItemElement(groupIndex, HOME_LANDING_ITEM_INDEX)?.focus({
          preventScroll: true,
        });
      });
    },
    [getItemElement, setFocusedIndex],
  );

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const openFullPlayer = useCallback(() => {
    if (!session.fullPlayerPath) return;
    navigate(session.fullPlayerPath, {
      state: { expandFromMiniPlayer: true },
    });
  }, [navigate, session.fullPlayerPath]);

  useEffect(() => {
    if (!isStackedLayout || !limitedHomeEsc) return undefined;

    limitedHomeEsc.setHandler(() => {
      if (!showHeaderMini || miniPlayerSlotIndex < 0) return false;
      enterContent();
      setFocusedGroupIndex(HOME_HEADER_GROUP);
      setFocusedIndex(HOME_HEADER_GROUP, miniPlayerSlotIndex);
      requestAnimationFrame(() => {
        getItemElement(HOME_HEADER_GROUP, miniPlayerSlotIndex)?.focus({
          preventScroll: true,
        });
      });
      return true;
    });

    return () => limitedHomeEsc.clearHandler();
  }, [
    isStackedLayout,
    limitedHomeEsc,
    showHeaderMini,
    miniPlayerSlotIndex,
    enterContent,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
  ]);

  const handleDismissBanner = useCallback(() => {
    setBannerVisible(false);
  }, []);

  const skipBannerGroup = useCallback(() => {
    if (!bannerVisible && focusedGroupIndex === HOME_BANNER_GROUP) {
      if (isStackedLayout && stackedBodyLaneCount > 0) {
        setFocusedGroupIndex(HOME_FIRST_SWIMLANE_GROUP);
        return true;
      }
      if (!isStackedLayout && isMusicBrowse) {
        setFocusedGroupIndex(FILTERS_GROUP);
        return true;
      }
      setFocusedGroupIndex(HOME_HEADER_GROUP);
      return true;
    }
    return false;
  }, [
    bannerVisible,
    focusedGroupIndex,
    isStackedLayout,
    stackedBodyLaneCount,
    isMusicBrowse,
    setFocusedGroupIndex,
  ]);

  useLayoutEffect(() => {
    skipBannerGroup();
  }, [skipBannerGroup]);

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: focusConfig.firstBodyGroup,
    lastFocusableGroupIndex: focusConfig.lastBodyGroup,
    getFocusedElement,
    screenId: isStackedLayout ? "home-limited" : undefined,
    scrollEnabled: isStackedLayout,
  });

  const prevFocusedGroupRef = useRef(focusedGroupIndex);

  const handleSelectFilter = useCallback(
    (filterId, index) => {
      setField("activeFilterId", filterId);
      setFocusedIndex(FILTERS_GROUP, index);
      setFocusedIndex(SWIMLANE_GROUP, 0);
    },
    [setField, setFocusedIndex],
  );

  useLayoutEffect(() => {
    if (isStackedLayout) return;

    const enteredFilters =
      focusedGroupIndex === FILTERS_GROUP &&
      prevFocusedGroupRef.current !== FILTERS_GROUP;

    if (enteredFilters && activeFilterIndex >= 0) {
      setFocusedIndex(FILTERS_GROUP, activeFilterIndex);
    } else if (
      activeFilterIndex >= 0 &&
      memory.groupItemIndexes?.[FILTERS_GROUP] === undefined
    ) {
      setFocusedIndex(FILTERS_GROUP, activeFilterIndex);
    }

    prevFocusedGroupRef.current = focusedGroupIndex;
  }, [
    isStackedLayout,
    focusedGroupIndex,
    activeFilterIndex,
    memory.groupItemIndexes,
    setFocusedIndex,
  ]);

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  const laneTitle = activeFilterId
    ? getLimitedHomeFilterLabel(activeFilterId)
    : "Music";

  const headerLayout = useHomeHeaderLayout();
  const scrollableHeader = headerLayout === HOME_HEADER_LAYOUT.SCROLL;
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const headerProps = {
    layoutMode,
    groupIndex: HOME_HEADER_GROUP,
    focused: isContentGroupActive(HOME_HEADER_GROUP),
    focusedItemIndex: getItemFocusIndex(HOME_HEADER_GROUP),
    registerItemRef,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    browseTabs,
    activeBrowseTab: effectiveBrowseTab,
    onBrowseTabChange: setBrowseTab,
    showContentSwitcher: shouldShowBrowseContentSwitcher,
    showMiniPlayer: showHeaderMini,
    miniPlayerTitle: session.title,
    miniPlayerSubtitle: session.subtitle,
    miniPlayerThumbnail: session.thumbnail,
    miniPlayerPlaying: !session.isPaused,
    miniPlayerVariant: session.variant,
    onMiniPlayerSelect: openFullPlayer,
  };

  return (
    <div
      ref={shellRef}
      className={[
        "tv-home",
        "tv-home--limited",
        "tv-screen-overlay",
        isStackedLayout ? "tv-home--limited-stacked" : "tv-home--limited-filter",
        scrollableHeader ? "tv-home--header-scroll" : "tv-home--header-sticky",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="tv-home__ab-badge" aria-hidden="true">
        Header {headerLayout} · Layout {layoutMode}
      </p>
      {!scrollableHeader ? (
        <div ref={headerRef} className="tv-screen-overlay__header">
          <TvLimitedHomeHeaderSection {...headerProps} />
        </div>
      ) : null}
      <div ref={viewportRef} className="tv-home__scroll tv-screen-overlay__scroll">
        <div
          ref={innerRef}
          className={innerClassName}
          style={
            isStackedLayout
              ? { transform: `translateY(-${offsetY}px)` }
              : undefined
          }
        >
          {scrollableHeader ? (
            <TvLimitedHomeHeaderSection
              {...headerProps}
              scrollable
              registerGroupRef={registerGroupRef}
            />
          ) : null}
          {bannerVisible ? (
            <div
              className="tv-home__scroll-group tv-home__scroll-group--promo-banner tv-home__content-inset"
              ref={(node) => registerGroupRef(HOME_BANNER_GROUP, node)}
            >
              <TvHomeBanner
                groupIndex={HOME_BANNER_GROUP}
                focused={isContentGroupActive(HOME_BANNER_GROUP)}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDismiss={handleDismissBanner}
              />
            </div>
          ) : null}

          {isStackedLayout ? (
            <LimitedHomeStackedBody
              activeBrowseTab={effectiveBrowseTab}
              showMidStackAd={showBannerAd}
              registerGroupRef={registerGroupRef}
              registerItemRef={registerItemRef}
              isContentGroupActive={isContentGroupActive}
              getItemFocusIndex={getItemFocusIndex}
              setFocusedIndex={setFocusedIndex}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              enterNavFromContent={enterNavFromContent}
              onHistoryCleared={onListenAgainCleared}
              onEpisodeRailCleared={onEpisodeRailCleared}
            />
          ) : isMusicBrowse ? (
            <div className="tv-home__limited-filter-body">
              <LimitedHomeFilterBody
                filters={filters}
                activeFilterId={activeFilterId}
                channels={channels}
                laneTitle={laneTitle}
                registerGroupRef={registerGroupRef}
                registerItemRef={registerItemRef}
                isContentGroupActive={isContentGroupActive}
                getItemFocusIndex={getItemFocusIndex}
                setFocusedIndex={setFocusedIndex}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSelectFilter={handleSelectFilter}
                onSelectChannel={openChannelInfo}
                onMore={() => navigate(`/more/music/${activeFilterId}`)}
              />
            </div>
          ) : (
            <div className="tv-home__scroll-group tv-home__content-inset">
              <p className="tv-home__catalog-proof">
                Switch to Music or use layout B for podcasts/radio stacks.
              </p>
            </div>
          )}

          {isStackedLayout ? (
            <p className="tv-home__catalog-proof tv-home__content-inset">
              Limited Home ({layoutMode}). Territory:{" "}
              <strong>{musicLineupLabel(musicLineupMode)}</strong> (
              <code>{catalogScope}</code>). Toggle layout on{" "}
              <code>/settings/user-type</code> (prototype).
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
