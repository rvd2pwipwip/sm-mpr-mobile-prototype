import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import ContentTileCard from "./ContentTileCard";
import LibraryHistoryEmptyCard from "./LibraryHistoryEmptyCard";
import ListenAgainCard from "./ListenAgainCard";
import {
  LISTEN_AGAIN_RAIL_SLOT_CAP,
} from "../constants/listenHistory";
import {
  MY_LIBRARY_HISTORY_BY_SEGMENT,
  myLibraryHistoryMorePath,
} from "../constants/myLibraryHistory";
import { useListenHistory } from "../context/ListenHistoryContext";

/**
 * One My Library listen-history swimlane (music, podcasts, or radio).
 *
 * @param {{ segment: 'music' | 'podcasts' | 'radio' }} props
 */
export default function LibraryHistoryRail({ segment }) {
  const navigate = useNavigate();
  const { items } = useListenHistory();
  const cfg = MY_LIBRARY_HISTORY_BY_SEGMENT[segment];
  if (!cfg) return null;

  const filtered = items.filter((x) => x.kind === cfg.listenKind);
  const isEmpty = filtered.length === 0;
  const ghostCount = isEmpty
    ? Math.max(0, LISTEN_AGAIN_RAIL_SLOT_CAP - 1)
    : filtered.length >= LISTEN_AGAIN_RAIL_SLOT_CAP
      ? 0
      : LISTEN_AGAIN_RAIL_SLOT_CAP - filtered.length;

  return (
    <ContentSwimlane
      title={cfg.swimlaneTitle}
      alwaysShowMore
      onMore={() => navigate(myLibraryHistoryMorePath(segment))}
    >
      {isEmpty ? (
        <>
          <LibraryHistoryEmptyCard label={cfg.emptySwimlaneMessage} />
          {Array.from({ length: ghostCount }).map((_, i) => (
            <ContentTileCard
              key={`library-history-${segment}-ghost-${i}`}
              ghost
              imageUrl=""
              title=""
            />
          ))}
        </>
      ) : (
        <>
          {filtered.map((item) => (
            <ListenAgainCard
              key={`${item.kind}-${item.id}`}
              item={item}
              navigate={navigate}
            />
          ))}
          {Array.from({ length: ghostCount }).map((_, i) => (
            <ContentTileCard
              key={`library-history-${segment}-ghost-${i}`}
              ghost
              imageUrl=""
              title=""
            />
          ))}
        </>
      )}
    </ContentSwimlane>
  );
}
