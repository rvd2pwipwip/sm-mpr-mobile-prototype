import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readStoredContentProfileMode,
  writeStoredContentProfileMode,
} from "@sm-mpr/shared/constants/contentProfileStorage.js";
import {
  CONTENT_PROFILE_MODE,
  DEFAULT_CONTENT_PROFILE_MODE,
  enabledContentTypesForMode,
  enabledSearchResultLanes,
  isContentTypeEnabled as isContentTypeEnabledForTypes,
  shouldShowBrowseContentSwitcher,
} from "@sm-mpr/shared/constants/productProfile.js";

const ContentProfileContext = createContext(null);

function initialContentProfileMode() {
  return readStoredContentProfileMode() ?? DEFAULT_CONTENT_PROFILE_MODE;
}

export function ContentProfileProvider({ children }) {
  const [contentProfileMode, setContentProfileMode] = useState(
    initialContentProfileMode,
  );

  const enabledContentTypes = useMemo(
    () => enabledContentTypesForMode(contentProfileMode),
    [contentProfileMode],
  );

  useEffect(() => {
    writeStoredContentProfileMode(contentProfileMode);
  }, [contentProfileMode]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-content-profile",
      contentProfileMode,
    );
    return () => {
      document.documentElement.removeAttribute("data-content-profile");
    };
  }, [contentProfileMode]);

  const isContentTypeEnabled = useCallback(
    (contentType) =>
      isContentTypeEnabledForTypes(contentType, enabledContentTypes),
    [enabledContentTypes],
  );

  const value = useMemo(
    () => ({
      contentProfileMode,
      setContentProfileMode,
      enabledContentTypes,
      isContentTypeEnabled,
      shouldShowBrowseContentSwitcher: shouldShowBrowseContentSwitcher(
        enabledContentTypes,
      ),
      enabledSearchResultLanes: enabledSearchResultLanes(enabledContentTypes),
      isMusicOnlyProfile:
        contentProfileMode === CONTENT_PROFILE_MODE.musicOnly,
    }),
    [contentProfileMode, enabledContentTypes, isContentTypeEnabled],
  );

  return (
    <ContentProfileContext.Provider value={value}>
      {children}
    </ContentProfileContext.Provider>
  );
}

export function useContentProfile() {
  const ctx = useContext(ContentProfileContext);
  if (!ctx) {
    throw new Error(
      "useContentProfile must be used within ContentProfileProvider",
    );
  }
  return ctx;
}

export { CONTENT_PROFILE_MODE };
