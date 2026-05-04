import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LISTEN_HISTORY_MAX_STORED } from "../constants/listenHistory";

/**
 * Recently listened entries for “Listen again” (prototype). In-memory only; starts empty.
 * @typedef {{ kind: 'music', id: string } | { kind: 'podcast', id: string }} ListenHistoryItem
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

  const clearListenHistory = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      recordMusicChannelListen,
      recordPodcastShowListen,
      clearListenHistory,
    }),
    [items, recordMusicChannelListen, recordPodcastShowListen, clearListenHistory],
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
