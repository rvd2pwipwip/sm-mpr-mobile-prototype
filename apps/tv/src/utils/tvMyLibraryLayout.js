import {
  getVisibleMyLibrarySections,
  MY_LIBRARY_SECTION_ID,
} from "@sm-mpr/shared/constants/myLibrarySections.js";
import { MY_LIBRARY_HISTORY_BY_SEGMENT } from "@sm-mpr/shared/constants/myLibraryHistory.js";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import { getRadioStationById } from "@sm-mpr/shared/data/radioStations.js";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import {
  getLibraryHistorySwimlaneSlotCount,
  getMusicSwimlaneSlotCount,
  getEpisodeLibrarySwimlaneSlotCount,
} from "./swimlaneUtils.js";
import { buildTvPodcastLibraryRails } from "./tvPodcastLibraryRails.js";

const APP_INFO_SLOT_COUNT = 4;

/**
 * @param {readonly string[]} enabledContentTypes
 * @param {{
 *   listenHistoryItems: readonly { kind: string }[],
 *   filterListenHistory: (items: readonly unknown[]) => readonly unknown[],
 *   likesItems: readonly { kind: string, id: string }[],
 *   podcastUserState: object,
 * }} data
 */
export function buildTvMyLibraryFocusLayout(
  enabledContentTypes,
  {
    listenHistoryItems,
    filterListenHistory,
    likesItems,
    podcastUserState,
  },
) {
  const visibleSections = getVisibleMyLibrarySections(enabledContentTypes);
  const itemCounts = {};
  const swimlaneGroups = [];
  const sectionGroups = {};
  let groupIndex = 0;

  function addGroup(sectionId, slotCount) {
    sectionGroups[sectionId] = groupIndex;
    itemCounts[groupIndex] = slotCount;
    swimlaneGroups.push(groupIndex);
    groupIndex += 1;
  }

  for (const section of visibleSections) {
    switch (section.id) {
      case MY_LIBRARY_SECTION_ID.appInfo:
        addGroup(section.id, APP_INFO_SLOT_COUNT);
        break;

      case MY_LIBRARY_SECTION_ID.musicHistory: {
        const filtered = filterListenHistory(listenHistoryItems).filter(
          (item) => item.kind === MY_LIBRARY_HISTORY_BY_SEGMENT.music.listenKind,
        );
        addGroup(
          section.id,
          getLibraryHistorySwimlaneSlotCount(filtered.length),
        );
        break;
      }

      case MY_LIBRARY_SECTION_ID.likedMusic: {
        const count = likesItems.filter((entry) => {
          if (entry.kind !== "music") return false;
          return Boolean(getMusicChannelById(entry.id));
        }).length;
        if (count > 0) {
          addGroup(section.id, getMusicSwimlaneSlotCount(count));
        }
        break;
      }

      case MY_LIBRARY_SECTION_ID.podcastHistory: {
        const filtered = filterListenHistory(listenHistoryItems).filter(
          (item) =>
            item.kind === MY_LIBRARY_HISTORY_BY_SEGMENT.podcasts.listenKind,
        );
        addGroup(
          section.id,
          getLibraryHistorySwimlaneSlotCount(filtered.length),
        );
        break;
      }

      case MY_LIBRARY_SECTION_ID.podcastUserSwimlanes: {
        const rails = buildTvPodcastLibraryRails(podcastUserState);
        sectionGroups[section.id] = groupIndex;
        rails.forEach((rail) => {
          itemCounts[groupIndex] =
            rail.kind === "episodes"
              ? getEpisodeLibrarySwimlaneSlotCount(rail.sourceCount)
              : getMusicSwimlaneSlotCount(rail.sourceCount);
          swimlaneGroups.push(groupIndex);
          groupIndex += 1;
        });
        break;
      }

      case MY_LIBRARY_SECTION_ID.radioHistory: {
        const filtered = filterListenHistory(listenHistoryItems).filter(
          (item) => item.kind === MY_LIBRARY_HISTORY_BY_SEGMENT.radio.listenKind,
        );
        addGroup(
          section.id,
          getLibraryHistorySwimlaneSlotCount(filtered.length),
        );
        break;
      }

      case MY_LIBRARY_SECTION_ID.likedRadio: {
        const count = likesItems.filter((entry) => {
          if (entry.kind !== "radio") return false;
          return Boolean(
            getRadioStationById(entry.id) ??
              resolveRadioStationForStub(entry.id),
          );
        }).length;
        if (count > 0) {
          addGroup(section.id, getMusicSwimlaneSlotCount(count));
        }
        break;
      }

      default:
        break;
    }
  }

  const groupCount = Math.max(1, groupIndex);
  const lastBodyGroup = Math.max(0, groupIndex - 1);

  return {
    visibleSections,
    sectionGroups,
    groupCount,
    itemCounts,
    swimlaneGroups,
    firstBodyGroup: 0,
    lastBodyGroup,
    defaultGroupIndex: 0,
    podcastGroupOffset: sectionGroups[MY_LIBRARY_SECTION_ID.podcastUserSwimlanes],
  };
}
