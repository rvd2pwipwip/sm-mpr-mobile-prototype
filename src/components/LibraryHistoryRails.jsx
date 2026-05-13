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
  MY_LIBRARY_HISTORY_SEGMENT_ORDER,
  myLibraryHistoryMorePath,
} from "../constants/myLibraryHistory";
import { useListenHistory } from "../context/ListenHistoryContext";

/** History swimlanes: History empty card + thumbnail ghosts when bare; else tiles + ghosts to cap. */
export default function LibraryHistoryRails() {
  const navigate = useNavigate();
  const { items } = useListenHistory();

  return (
    <>
      {MY_LIBRARY_HISTORY_SEGMENT_ORDER.map((segment) => {
        const cfg = MY_LIBRARY_HISTORY_BY_SEGMENT[segment];
        const filtered = items.filter((x) => x.kind === cfg.listenKind);
        const isEmpty = filtered.length === 0;
        const ghostCount = isEmpty
          ? Math.max(0, LISTEN_AGAIN_RAIL_SLOT_CAP - 1)
          : filtered.length >= LISTEN_AGAIN_RAIL_SLOT_CAP
            ? 0
            : LISTEN_AGAIN_RAIL_SLOT_CAP - filtered.length;

        return (
          <ContentSwimlane
            key={segment}
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
      })}
    </>
  );
}
