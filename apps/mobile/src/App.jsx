import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import BottomNav from "./components/BottomNav";
import LimitedCatalogFooterAd from "./components/LimitedCatalogFooterAd";
import AccountRequiredDialog from "./components/AccountRequiredDialog";
import GuestSkipLimitDialog from "./components/GuestSkipLimitDialog";
import MiniPlayer from "./components/MiniPlayer";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext";
import { AccountRequiredDialogProvider } from "./context/AccountRequiredDialogContext";
import { LikesProvider } from "./context/LikesContext";
import { ListenHistoryProvider } from "./context/ListenHistoryContext";
import { CategoryRailMemoryProvider } from "./context/CategoryRailMemoryContext.jsx";
import { CastPrototypeProvider } from "./context/CastPrototypeContext";
import { SharePrototypeProvider } from "./context/SharePrototypeContext";
import { PlaybackProvider } from "./context/PlaybackContext";
import { PodcastUserStateProvider } from "./context/PodcastUserStateContext";
import { CATALOG_SCOPE } from "./constants/catalogScope.js";
import { TerritoryProvider, useTerritory } from "./context/TerritoryContext.jsx";
import {
  ContentProfileProvider,
  useContentProfile,
} from "./context/ContentProfileContext.jsx";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
import RequireContentType from "./components/RequireContentType.jsx";
import RequireLibraryHistorySegment from "./components/RequireLibraryHistorySegment.jsx";
import RequireLibraryLikeKind from "./components/RequireLibraryLikeKind.jsx";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import Home from "./pages/Home";
import LimitedBrowse from "./pages/LimitedBrowse";
import ListenAgainMore from "./pages/ListenAgainMore";
import MusicChannelInfo from "./pages/MusicChannelInfo";
import MusicPlayer from "./pages/MusicPlayer";
import PodcastInfo from "./pages/PodcastInfo";
import PodcastPlayer from "./pages/PodcastPlayer";
import RadioPlayer from "./pages/RadioPlayer";
import RadioStationInfo from "./pages/RadioStationInfo";
import Search from "./pages/Search";
import SearchMusicBroadTagChannels from "./pages/SearchMusicBroadTagChannels";
import SearchMusicArtistChannels from "./pages/SearchMusicArtistChannels";
import SearchMusicCategory from "./pages/SearchMusicCategory";
import SearchMusicVibe from "./pages/SearchMusicVibe";
import SearchPodcastsCategory from "./pages/SearchPodcastsCategory";
import SearchPodcastsLibrary from "./pages/SearchPodcastsLibrary";
import SearchRadioGeoMore from "./pages/SearchRadioGeoMore";
import SearchRadioInternationalStack from "./pages/SearchRadioInternationalStack";
import SearchRadioStationGrid from "./pages/SearchRadioStationGrid";
import SearchCatalogMore from "./pages/SearchCatalogMore";
import SearchTagsMore from "./pages/SearchTagsMore";
import Info from "./pages/Info";
import InfoAbout from "./pages/InfoAbout";
import InfoContact from "./pages/InfoContact";
import MyLibrary from "./pages/MyLibrary";
import MyLibraryAccountSettings from "./pages/MyLibraryAccountSettings";
import MyLibraryHistoryMore from "./pages/MyLibraryHistoryMore";
import MyLibraryLikesMore from "./pages/MyLibraryLikesMore";
import Subscription from "./pages/Subscription";
import UpgradeStoreMock from "./pages/UpgradeStoreMock";
import SwimlaneMore from "./pages/SwimlaneMore";
import { readStoredBroadSearchBrowseTab } from "./constants/searchBrowsePaths.js";
import { hideFooterChromeForPath } from "./utils/hideFooterChromeForPath";
import CastPrototypeDialogs from "./components/CastPrototypeDialogs";
import SharePrototypeOverlays from "./components/SharePrototypeOverlays";

/** Remount when channel or user type changes so pre-roll + playback state reset. */
function MusicPlayerRoute() {
  const { channelId } = useParams();
  const { userType } = useUserType();
  return <MusicPlayer key={`${channelId}-${userType}`} />;
}

function PodcastPlayerRoute() {
  const { podcastId, episodeId } = useParams();
  const { userType } = useUserType();
  return <PodcastPlayer key={`${podcastId}-${episodeId}-${userType}`} />;
}

function RadioPlayerRoute() {
  const { stationId } = useParams();
  const { userType } = useUserType();
  return <RadioPlayer key={`${stationId}-${userType}`} />;
}

/** `/info` root: **broad** catalog sends users to My Library; **limited** shows classic Info hub. */
function InfoRootRoute() {
  const { catalogScope } = useTerritory();
  if (catalogScope === CATALOG_SCOPE.broad) {
    return <Navigate to="/my-library" replace />;
  }
  return <Info />;
}

/** `/`: **broad** Home; **limited** Browse landing (`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`). */
function HomeOrLimitedBrowse() {
  const { catalogScope } = useTerritory();
  if (catalogScope === CATALOG_SCOPE.limited) {
    return <LimitedBrowse />;
  }
  return <Home />;
}

/** **Broad:** `/search` redirects to last Music \| Podcasts \| Radio (session) or `/search/music`. **Limited:** `Search` at canonical `/search`. */
function SearchEntryRoute() {
  const { catalogScope } = useTerritory();
  const { isContentTypeEnabled } = useContentProfile();
  if (catalogScope === CATALOG_SCOPE.limited) {
    return <Search />;
  }
  let tab = readStoredBroadSearchBrowseTab() ?? "music";
  if (tab === "podcasts" && !isContentTypeEnabled(CONTENT_TYPE.podcasts)) {
    tab = "music";
  }
  if (tab === "radio" && !isContentTypeEnabled(CONTENT_TYPE.radio)) {
    tab = "music";
  }
  return <Navigate to={`/search/${tab}`} replace />;
}

/** **Limited:** `/search/*` tab paths fold to `/search` (keep `?q=`). **Broad:** `Search` as today. */
function SearchTabRoute() {
  const { catalogScope } = useTerritory();
  const location = useLocation();
  if (catalogScope === CATALOG_SCOPE.limited) {
    return <Navigate to={`/search${location.search}`} replace />;
  }
  return <Search />;
}

function AppRoutes() {
  const location = useLocation();
  const { catalogScope } = useTerritory();
  const hideBottomNav = hideFooterChromeForPath(location.pathname);
  const showBottomNav =
    catalogScope === CATALOG_SCOPE.broad && !hideBottomNav;

  return (
    <>
      <VisualAdsHtmlSync />
      <GuestSkipLimitDialog />
      <AccountRequiredDialog />
      <Routes>
        <Route path="/" element={<HomeOrLimitedBrowse />} />
        <Route path="/upgrade/store" element={<UpgradeStoreMock />} />
        <Route path="/upgrade" element={<Subscription />} />
        <Route path="/more/listen-again" element={<ListenAgainMore />} />
        <Route path="/more/:categoryId" element={<SwimlaneMore />} />
        <Route path="/music/:channelId" element={<MusicChannelInfo />} />
        <Route path="/music/:channelId/play" element={<MusicPlayerRoute />} />
        <Route
          path="/podcast/:podcastId/play/:episodeId"
          element={
            <RequireContentType contentType={CONTENT_TYPE.podcasts}>
              <PodcastPlayerRoute />
            </RequireContentType>
          }
        />
        <Route
          path="/podcast/:podcastId"
          element={
            <RequireContentType contentType={CONTENT_TYPE.podcasts}>
              <PodcastInfo />
            </RequireContentType>
          }
        />
        <Route path="/search/browse/music/vibe/:vibeId/tag/:tagSlug/sub/:subSlug" element={<SearchMusicBroadTagChannels />} />
        <Route path="/search/browse/music/vibe/:vibeId/tag/:tagSlug" element={<SearchMusicBroadTagChannels />} />
        <Route path="/search/browse/music/vibe/:vibeId" element={<SearchMusicVibe />} />
        <Route path="/search/browse/music/category/:categoryId" element={<SearchMusicCategory />} />
        <Route path="/search/browse/music/artist/:artistId" element={<SearchMusicArtistChannels />} />
        <Route
          path="/radio/:stationId/play"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <RadioPlayerRoute />
            </RequireContentType>
          }
        />
        <Route
          path="/radio/:stationId"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <RadioStationInfo />
            </RequireContentType>
          }
        />
        <Route
          path="/search/browse/radio/international/*"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <SearchRadioInternationalStack />
            </RequireContentType>
          }
        />
        <Route
          path="/search/browse/radio/near-you"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <SearchRadioStationGrid />
            </RequireContentType>
          }
        />
        <Route
          path="/search/browse/radio/format/:formatId"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <SearchRadioStationGrid />
            </RequireContentType>
          }
        />
        <Route
          path="/search/browse/podcasts/library/:librarySection"
          element={
            <RequireContentType contentType={CONTENT_TYPE.podcasts}>
              <SearchPodcastsLibrary />
            </RequireContentType>
          }
        />
        <Route
          path="/search/browse/podcasts/category/:categoryId"
          element={
            <RequireContentType contentType={CONTENT_TYPE.podcasts}>
              <SearchPodcastsCategory />
            </RequireContentType>
          }
        />
        <Route
          path="/search/more/radio-geo/*"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <SearchRadioGeoMore />
            </RequireContentType>
          }
        />
        <Route path="/search/more/catalog" element={<SearchCatalogMore />} />
        <Route path="/search/more/tags" element={<SearchTagsMore />} />
        <Route path="/search/music" element={<SearchTabRoute />} />
        <Route
          path="/search/podcasts"
          element={
            <RequireContentType contentType={CONTENT_TYPE.podcasts}>
              <SearchTabRoute />
            </RequireContentType>
          }
        />
        <Route
          path="/search/radio"
          element={
            <RequireContentType contentType={CONTENT_TYPE.radio}>
              <SearchTabRoute />
            </RequireContentType>
          }
        />
        <Route path="/search" element={<SearchEntryRoute />} />
        <Route path="/info/contact" element={<InfoContact />} />
        <Route path="/info/about" element={<InfoAbout />} />
        <Route path="/info" element={<InfoRootRoute />} />
        <Route path="/my-library/account-settings" element={<MyLibraryAccountSettings />} />
        <Route
          path="/my-library/history/:historySegment"
          element={
            <RequireLibraryHistorySegment>
              <MyLibraryHistoryMore />
            </RequireLibraryHistorySegment>
          }
        />
        <Route
          path="/my-library/likes/:likeKind"
          element={
            <RequireLibraryLikeKind>
              <MyLibraryLikesMore />
            </RequireLibraryLikeKind>
          }
        />
        <Route path="/my-library" element={<MyLibrary />} />
      </Routes>
      {hideBottomNav ? null : (
        <>
          <MiniPlayer />
          {showBottomNav ? <BottomNav /> : <LimitedCatalogFooterAd />}
        </>
      )}
    </>
  );
}

/** Route table; `BottomNav` is a sibling of `Routes` (hidden on full-screen music / podcast / radio play). */
function App() {
  return (
    <UserTypeProvider>
      <AccountRequiredDialogProvider>
        <ContentProfileProvider>
        <TerritoryProvider>
          <GuestMusicSkipProvider>
          <GuestPrerollGraceProvider>
            <ListenHistoryProvider>
              <LikesProvider>
                <PodcastUserStateProvider>
                  <PlaybackProvider>
                    <CastPrototypeProvider>
                      <SharePrototypeProvider>
                        <>
                          <CastPrototypeDialogs />
                          <SharePrototypeOverlays />
                          <CategoryRailMemoryProvider>
                            <AppRoutes />
                          </CategoryRailMemoryProvider>
                        </>
                      </SharePrototypeProvider>
                    </CastPrototypeProvider>
                  </PlaybackProvider>
                </PodcastUserStateProvider>
              </LikesProvider>
            </ListenHistoryProvider>
          </GuestPrerollGraceProvider>
        </GuestMusicSkipProvider>
        </TerritoryProvider>
        </ContentProfileProvider>
      </AccountRequiredDialogProvider>
    </UserTypeProvider>
  );
}

export default App;
