import { useEffect, useRef } from "react";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvSearchBrowseTabs from "./TvSearchBrowseTabs.jsx";
import "./TvSearchBrowseHeader.css";

/**
 * Fixed Search header — search field + Clear (Figma `headerSearch`).
 * Browse tabs render in scroll content on Music/Podcasts/Radio browse (field-only header).
 */
export default function TvSearchBrowseHeader({
  headerRef,
  query,
  onQueryChange,
  showBrowseTabs,
  browseTabs,
  activeBrowseTab,
  searchPlaceholder,
  registerItemRef,
  isItemFocused,
  onClear,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  searchRowGroup = 0,
  browseTabsGroup = 1,
}) {
  const inputRef = useRef(null);
  const showClear = query.length > 0;
  const fieldFocused = isItemFocused(searchRowGroup, 0);

  useEffect(() => {
    if (fieldFocused && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [fieldFocused]);

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      onMoveDown?.(event);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      onMoveUp?.(event);
      return;
    }
    if (event.key === "ArrowLeft" && inputRef.current?.selectionStart === 0) {
      event.preventDefault();
      event.stopPropagation();
      onMoveLeft?.(event);
      return;
    }
    if (
      event.key === "ArrowRight" &&
      inputRef.current?.selectionStart === query.length
    ) {
      event.preventDefault();
      event.stopPropagation();
      onMoveRight?.(event);
    }
  };

  return (
    <header
      ref={headerRef}
      className="tv-search-header tv-screen-overlay__header"
    >
      <div className="tv-search-header__field-row">
        <div
          className={[
            "tv-search-header__field-wrap",
            fieldFocused ? "tv-search-header__field-wrap--focused" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              registerItemRef(searchRowGroup, 0, node);
            }}
            id="tv-search-query"
            type="search"
            name="q"
            inputMode="search"
            autoComplete="off"
            className="tv-search-header__input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Search catalog"
          />
          {!showClear ? (
            <span className="tv-search-header__search-icon" aria-hidden="true">
              <img src="/search.svg" alt="" width={40} height={40} />
            </span>
          ) : null}
        </div>

        {showClear ? (
          <KeyboardWrapper
            ref={(node) => registerItemRef(searchRowGroup, 1, node)}
            onSelect={onClear}
            onUp={onMoveUp}
            onDown={onMoveDown}
            onLeft={onMoveLeft}
            onRight={onMoveRight}
          >
            {(focusProps) => (
              <button
                type="button"
                {...focusProps}
                className={[
                  "tv-search-header__clear",
                  isItemFocused(searchRowGroup, 1)
                    ? "tv-search-header__clear--focused"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={onClear}
                aria-label="Clear search"
              >
                <img
                  src="/close.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="tv-search-header__clear-icon"
                  aria-hidden="true"
                />
                <span>Clear</span>
              </button>
            )}
          </KeyboardWrapper>
        ) : null}
      </div>

      {showBrowseTabs && browseTabs.length > 0 ? (
        <TvSearchBrowseTabs
          browseTabs={browseTabs}
          activeBrowseTab={activeBrowseTab}
          browseTabsGroup={browseTabsGroup}
          registerItemRef={registerItemRef}
          isItemFocused={isItemFocused}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
        />
      ) : null}
    </header>
  );
}
