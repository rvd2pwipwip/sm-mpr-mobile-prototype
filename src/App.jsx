import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import BottomNav from "./components/BottomNav";
import AccountRequiredDialog from "./components/AccountRequiredDialog";
import GuestSkipLimitDialog from "./components/GuestSkipLimitDialog";
import MiniPlayer from "./components/MiniPlayer";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext";
import { AccountRequiredDialogProvider } from "./context/AccountRequiredDialogContext";
import { LikesProvider } from "./context/LikesContext";
import { ListenHistoryProvider } from "./context/ListenHistoryContext";
import { PlaybackProvider } from "./context/PlaybackContext";
import { PodcastUserStateProvider } from "./context/PodcastUserStateContext";
import { CATALOG_SCOPE } from "./constants/catalogScope.js";
import { TerritoryProvider, useTerritory } from "./context/TerritoryContext.jsx";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
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

function hideBottomNavForPath(pathname) {
  return (
    /^\/music\/[^/]+\/play\/?$/.test(pathname) ||
    /^\/podcast\/[^/]+\/play\/[^/]+\/?$/.test(pathname) ||
    /^\/radio\/[^/]+\/play\/?$/.test(pathname) ||
    /^\/upgrade\/store\/?$/.test(pathname)
  );
}

/** `/info` root: **broad** catalog sends users to My Library; **limited** shows classic Info hub. */
function InfoRootRoute() {
  const { catalogScope } = useTerritory();
  if (catalogScope === CATALOG_SCOPE.broad) {
    return <Navigate to="/my-library" replace />;
  }
  return <Info />;
}

/** `/`: **broad** Home; **limited** Browse landing (`docs/Plans/catalog-scope-search-browse-refactor.md`). */
function HomeOrLimitedBrowse() {
  const { catalogScope } = useTerritory();
  if (catalogScope === CATALOG_SCOPE.limited) {
    return <LimitedBrowse />;
  }
  return <Home />;
}

/** **Broad:** `/search` redirects to `/search/music`. **Limited:** `Search` at canonical `/search`. */
function SearchEntryRoute() {
  const { catalogScope } = useTerritory();
  if (catalogScope === CATALOG_SCOPE.limited) {
    return <Search />;
  }
  return <Navigate to="/search/music" replace />;
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
  const hideBottomNav = hideBottomNavForPath(location.pathname);
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
        <Route path="/podcast/:podcastId/play/:episodeId" element={<PodcastPlayerRoute />} />
        <Route path="/podcast/:podcastId" element={<PodcastInfo />} />
        <Route path="/search/browse/music/vibe/:vibeId/tag/:tagSlug/sub/:subSlug" element={<SearchMusicBroadTagChannels />} />
        <Route path="/search/browse/music/vibe/:vibeId/tag/:tagSlug" element={<SearchMusicBroadTagChannels />} />
        <Route path="/search/browse/music/vibe/:vibeId" element={<SearchMusicVibe />} />
        <Route path="/search/browse/music/category/:categoryId" element={<SearchMusicCategory />} />
        <Route path="/radio/:stationId/play" element={<RadioPlayerRoute />} />
        <Route path="/radio/:stationId" element={<RadioStationInfo />} />
        <Route path="/search/browse/radio/international/*" element={<SearchRadioInternationalStack />} />
        <Route path="/search/browse/radio/near-you" element={<SearchRadioStationGrid />} />
        <Route path="/search/browse/radio/format/:formatId" element={<SearchRadioStationGrid />} />
        <Route path="/search/browse/podcasts/library/:librarySection" element={<SearchPodcastsLibrary />} />
        <Route path="/search/browse/podcasts/category/:categoryId" element={<SearchPodcastsCategory />} />
        <Route path="/search/more/radio-geo/*" element={<SearchRadioGeoMore />} />
        <Route path="/search/more/catalog" element={<SearchCatalogMore />} />
        <Route path="/search/more/tags" element={<SearchTagsMore />} />
        <Route path="/search/music" element={<SearchTabRoute />} />
        <Route path="/search/podcasts" element={<SearchTabRoute />} />
        <Route path="/search/radio" element={<SearchTabRoute />} />
        <Route path="/search" element={<SearchEntryRoute />} />
        <Route path="/info/contact" element={<InfoContact />} />
        <Route path="/info/about" element={<InfoAbout />} />
        <Route path="/info" element={<InfoRootRoute />} />
        <Route path="/my-library/account-settings" element={<MyLibraryAccountSettings />} />
        <Route
          path="/my-library/history/:historySegment"
          element={<MyLibraryHistoryMore />}
        />
        <Route path="/my-library/likes/:likeKind" element={<MyLibraryLikesMore />} />
        <Route path="/my-library" element={<MyLibrary />} />
      </Routes>
      {hideBottomNav ? null : (
        <>
          <MiniPlayer />
          {showBottomNav ? <BottomNav /> : null}
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
        <TerritoryProvider>
          <GuestMusicSkipProvider>
          <GuestPrerollGraceProvider>
            <ListenHistoryProvider>
              <LikesProvider>
                <PodcastUserStateProvider>
                  <PlaybackProvider>
                    <AppRoutes />
                  </PlaybackProvider>
                </PodcastUserStateProvider>
              </LikesProvider>
            </ListenHistoryProvider>
          </GuestPrerollGraceProvider>
        </GuestMusicSkipProvider>
        </TerritoryProvider>
      </AccountRequiredDialogProvider>
    </UserTypeProvider>
  );
}

export default App;
