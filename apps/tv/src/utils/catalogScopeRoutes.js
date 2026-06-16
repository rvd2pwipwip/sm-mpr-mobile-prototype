import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";

/**
 * When catalog scope changes, return a router target that matches the active shell.
 * @param {string} pathname
 * @param {string} search
 * @param {string} catalogScope
 * @param {string} broadSearchTab
 * @returns {{ pathname: string, search?: string } | null}
 */
export function getCatalogScopeRouteTarget(
  pathname,
  search,
  catalogScope,
  broadSearchTab,
) {
  if (catalogScope === CATALOG_SCOPE.limited) {
    if (
      pathname.startsWith("/search/music") ||
      pathname.startsWith("/search/podcasts") ||
      pathname.startsWith("/search/radio")
    ) {
      return { pathname: "/search", search };
    }
  }

  if (catalogScope === CATALOG_SCOPE.broad && pathname === "/search") {
    return { pathname: `/search/${broadSearchTab}`, search: "" };
  }

  return null;
}
