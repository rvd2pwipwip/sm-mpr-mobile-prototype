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
 * Focus indices in group 0: 0 = field, 1 = Clear (when query non-empty), then tabs.
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
  onFieldFocus,
  onFieldBlur,
  onClear,
  onDismissKeyboardStub,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  const navigate = useNavigate();
  const headerRef = useTvSearchHeaderOffset();
  const inputRef = useRef(null);
  const showClear = query.length > 0;
  const tabStartIndex = showClear ? 2 : 1;

  useEffect(() => {
    if (isItemFocused(0, 0) && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isItemFocused]);

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onDismissKeyboardStub?.();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onDismissKeyboardStub?.();
      return;
    }
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
            isItemFocused(0, 0) ? "tv-search-header__field-wrap--focused" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              registerItemRef(0, 0, node);
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
            onFocus={() => onFieldFocus?.()}
            onBlur={() => onFieldBlur?.()}
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
            ref={(node) => registerItemRef(0, 1, node)}
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
                  isItemFocused(0, 1)
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
          {browseTabs.map((tab, tabIndex) => {
            const focusIndex = tabStartIndex + tabIndex;
            return (
              <KeyboardWrapper
                key={tab.id}
                ref={(node) => registerItemRef(0, focusIndex, node)}
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
                    focused={isItemFocused(0, focusIndex)}
                    role="tab"
                    aria-selected={tab.id === activeBrowseTab}
                  />
                )}
              </KeyboardWrapper>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
