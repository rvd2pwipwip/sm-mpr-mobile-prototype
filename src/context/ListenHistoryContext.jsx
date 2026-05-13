import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LISTEN_HISTORY_MAX_STORED, isListenHistoryKind } from "../constants/listenHistory";

/**
 * Recently listened entries for “Listen again” (prototype). In-memory only; starts empty.
 * @typedef {{ kind: 'music', id: string } | { kind: 'podcast', id: string } | { kind: 'radio', id: string }} ListenHistoryItem
 */

const ListenHistoryContext = createContext(null);

function bumpItem(list, item) {
  const filtered = list.filter(
    (x) => !(x.kind === item.kind && x.id === item.id),
  );
  return [item, ...filtered].slice(0, LISTEN_HISTORY_MAX_STORED);
}

export function ListenHistoryProvider({ children }) {
  const [items, setItems] = useState(/** @type {ListenHistoryItem[]} */ ([]));

  const recordMusicChannelListen = useCallback((channelId) => {
    if (!channelId) return;
    setItems((prev) =>
      bumpItem(prev, { kind: "music", id: channelId }),
    );
  }, []);

  /** Podcast **show** id (`Podcast.id`). Listen again navigates to Podcast Info */
  const recordPodcastShowListen = useCallback((podcastId) => {
    if (!podcastId) return;
    setItems((prev) =>
      bumpItem(prev, { kind: "podcast", id: podcastId }),
    );
  }, []);

  /** Radio **station** id (`RadioStation.id`). Same store as music / podcast. */
  const recordRadioStationListen = useCallback((radioStationId) => {
    if (!radioStationId) return;
    setItems((prev) =>
      bumpItem(prev, { kind: "radio", id: radioStationId }),
    );
  }, []);

  const clearListenHistory = useCallback(() => {
    setItems([]);
  }, []);

  const clearHistoryByKind = useCallback((kind) => {
    if (!isListenHistoryKind(kind)) return;
    setItems((prev) => prev.filter((x) => x.kind !== kind));
  }, []);

  const value = useMemo(
    () => ({
      items,
      recordMusicChannelListen,
      recordPodcastShowListen,
      recordRadioStationListen,
      clearListenHistory,
      clearHistoryByKind,
    }),
    [
      items,
      recordMusicChannelListen,
      recordPodcastShowListen,
      recordRadioStationListen,
      clearListenHistory,
      clearHistoryByKind,
    ],
  );

  return (
    <ListenHistoryContext.Provider value={value}>
      {children}
    </ListenHistoryContext.Provider>
  );
}

export function useListenHistory() {
  const ctx = useContext(ListenHistoryContext);
  if (!ctx) {
    throw new Error("useListenHistory must be used within ListenHistoryProvider");
  }
  return ctx;
}
