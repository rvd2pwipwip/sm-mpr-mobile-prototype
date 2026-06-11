import { useNavigate } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FilterButton from "../focus/FilterButton.jsx";
import "./TvSearchBrowseTabs.css";

/**
 * Music / Podcasts / Radio switcher — first row in Search browse scroll content (Figma `15822:35863`).
 */
export default function TvSearchBrowseTabs({
  browseTabs,
  activeBrowseTab,
  browseTabsGroup = 1,
  registerItemRef,
  registerGroupRef,
  isItemFocused,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  const navigate = useNavigate();

  if (!browseTabs?.length) return null;

  return (
    <div
      className="tv-search-browse-tabs tv-home__scroll-group"
      role="tablist"
      aria-label="Browse content type"
      ref={(node) => registerGroupRef?.(browseTabsGroup, node)}
    >
      <div className="tv-search-browse-tabs__row">
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
    </div>
  );
}
