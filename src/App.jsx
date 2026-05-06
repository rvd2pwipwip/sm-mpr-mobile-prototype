import { Routes, Route, useLocation, useParams } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import GuestSkipLimitDialog from "./components/GuestSkipLimitDialog";
import MiniPlayer from "./components/MiniPlayer";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext";
import { ListenHistoryProvider } from "./context/ListenHistoryContext";
import { PlaybackProvider } from "./context/PlaybackContext";
import { PodcastUserStateProvider } from "./context/PodcastUserStateContext";
import { TerritoryProvider } from "./context/TerritoryContext.jsx";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
import Home from "./pages/Home";
import ListenAgainMore from "./pages/ListenAgainMore";
import MusicChannelInfo from "./pages/MusicChannelInfo";
import MusicPlayer from "./pages/MusicPlayer";
import PodcastInfo from "./pages/PodcastInfo";
import PodcastPlayer from "./pages/PodcastPlayer";
import Search from "./pages/Search";
import SearchMusicBroadTagChannels from "./pages/SearchMusicBroadTagChannels";
import SearchMusicCategory from "./pages/SearchMusicCategory";
import SearchMusicVibe from "./pages/SearchMusicVibe";
import SearchTagsMore from "./pages/SearchTagsMore";
import Info from "./pages/Info";
import Subscription from "./pages/Subscription";
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

function hideBottomNavForPath(pathname) {
  return (
    /^\/music\/[^/]+\/play\/?$/.test(pathname) ||
    /^\/podcast\/[^/]+\/play\/[^/]+\/?$/.test(pathname)
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideBottomNav = hideBottomNavForPath(location.pathname);

  return (
    <>
      <VisualAdsHtmlSync />
      <GuestSkipLimitDialog />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/search/more/tags" element={<SearchTagsMore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<Info />} />
      </Routes>
      {hideBottomNav ? null : (
        <>
          <MiniPlayer />
          <BottomNav />
        </>
      )}
    </>
  );
}

/** Route table; `BottomNav` is a sibling of `Routes` (hidden on full-screen music / podcast play). */
function App() {
  return (
    <UserTypeProvider>
      <TerritoryProvider>
        <GuestMusicSkipProvider>
          <GuestPrerollGraceProvider>
            <ListenHistoryProvider>
              <PodcastUserStateProvider>
                <PlaybackProvider>
                  <AppRoutes />
                </PlaybackProvider>
              </PodcastUserStateProvider>
            </ListenHistoryProvider>
          </GuestPrerollGraceProvider>
        </GuestMusicSkipProvider>
      </TerritoryProvider>
    </UserTypeProvider>
  );
}

export default App;
