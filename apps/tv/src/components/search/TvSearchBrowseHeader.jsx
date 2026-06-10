import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FilterButton from "../focus/FilterButton.jsx";
import "./TvSearchBrowseHeader.css";

function useTvSearchHeaderOffset() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--tv-search-header-offset",
        `${el.offsetHeight}px`,
      );
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--tv-search-header-offset");
    };
  }, []);

  return ref;
}

/**
 * Fixed Search & Browse header — field, Clear, optional content-type tabs (browse mode).
 * Row 0 (searchRowGroup): field, Clear. Row 1 (browseTabsGroup): Music / Podcasts / Radio.
 * Up/Down moves between rows; Left/Right within a row. Left from first tab enters nav.
 */
export default function TvSearchBrowseHeader({
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
  const navigate = useNavigate();
  const headerRef = useTvSearchHeaderOffset();
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
    <header ref={headerRef} className="tv-search-header">
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
        <div
          className="tv-search-header__tabs"
          role="tablist"
          aria-label="Browse content type"
        >
          {browseTabs.map((tab, tabIndex) => (
              <KeyboardWrapper
                key={tab.id}
                ref={(node) => registerItemRef(browseTabsGroup, tabIndex, node)}
                onSelect={() => navigate(SEARCH_BROWSE[tab.id])}
                onUp={onMoveUp}
                onDown={onMoveDown}
                onLeft={onMoveLeft}
                onRight={onMoveRight}
              >
                {(focusProps) => (
                  <FilterButton
                    {...focusProps}
                    label={tab.label}
                    active={tab.id === activeBrowseTab}
                    focused={isItemFocused(browseTabsGroup, tabIndex)}
                    role="tab"
                    aria-selected={tab.id === activeBrowseTab}
                  />
                )}
              </KeyboardWrapper>
          ))}
        </div>
      ) : null}
    </header>
  );
}
