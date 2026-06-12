import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeRow from "./TvEpisodeRow.jsx";
import "./TvSearchEpisodeList.css";

/**
 * Episodes search lane — vertical list (Up/Down within lane).
 */
export default function TvSearchEpisodeList({
  title = "Episodes",
  rows,
  sourceCount,
  groupIndex,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onSelectRow,
  onMore,
}) {
  const totalCount = sourceCount ?? rows.length;
  const showMoreRow = totalCount > SWIMLANE_CARD_MAX;
  const visibleRows = rows.slice(0, SWIMLANE_CARD_MAX);
  const itemCount = visibleRows.length + (showMoreRow ? 1 : 0);
  const moreIndex = showMoreRow ? visibleRows.length : -1;

  const handleMoveUp = (index) => {
    if (index > 0) {
      onFocusChange?.(index - 1);
      return;
    }
    onMoveUp?.();
  };

  const handleMoveDown = (index) => {
    if (index < itemCount - 1) {
      onFocusChange?.(index + 1);
      return;
    }
    onMoveDown?.();
  };

  return (
    <section className="swimlane-row tv-search-episode-list" aria-label={title}>
      <h2 className="swimlane-row__title">{title}</h2>
      <ul className="tv-search-episode-list__rows" role="list">
        {visibleRows.map((row, index) => (
          <li key={row.episode.id} className="tv-search-episode-list__item">
            <KeyboardWrapper
              ref={(node) => registerItemRef(groupIndex, index, node)}
              onSelect={() => onSelectRow(row)}
              onUp={() => handleMoveUp(index)}
              onDown={() => handleMoveDown(index)}
            >
              {(focusProps) => (
                <TvEpisodeRow
                  {...focusProps}
                  episodeTitle={row.episode.title}
                  showTitle={row.podcast.title}
                  thumbnail={row.episode.thumbnail ?? row.podcast.thumbnail}
                  focused={focused && focusedIndex === index}
                />
              )}
            </KeyboardWrapper>
          </li>
        ))}
        {showMoreRow ? (
          <li className="tv-search-episode-list__item">
            <KeyboardWrapper
              ref={(node) => registerItemRef(groupIndex, moreIndex, node)}
              onSelect={onMore}
              onUp={() => handleMoveUp(moreIndex)}
              onDown={() => handleMoveDown(moreIndex)}
            >
              {(focusProps) => (
                <button
                  type="button"
                  className={[
                    "tv-search-episode-list__more",
                    focused && focusedIndex === moreIndex
                      ? "tv-search-episode-list__more--focused"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  tabIndex={-1}
                  {...focusProps}
                >
                  More episodes
                </button>
              )}
            </KeyboardWrapper>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
