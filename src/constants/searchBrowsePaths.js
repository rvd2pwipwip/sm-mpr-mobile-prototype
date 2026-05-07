/** Browse tab URLs for Search — URL is the source of truth for the content-type strip. */
export const SEARCH_BROWSE = {
  music: "/search/music",
  podcasts: "/search/podcasts",
  radio: "/search/radio",
};

/** Derive tab id from the pathname (only `/search` tree; defaults to music). */
export function getSearchBrowseTabFromPathname(pathname) {
  if (pathname.startsWith("/search/podcasts")) return "podcasts";
  if (pathname.startsWith("/search/radio")) return "radio";
  if (pathname.startsWith("/search/music")) return "music";
  return "music";
}
