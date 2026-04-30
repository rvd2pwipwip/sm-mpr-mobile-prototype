import { Routes, Route, useLocation, useParams } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import GuestSkipLimitDialog from "./components/GuestSkipLimitDialog";
import MiniPlayer from "./components/MiniPlayer";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext";
import { PlaybackProvider } from "./context/PlaybackContext";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
import Home from "./pages/Home";
import MusicChannelInfo from "./pages/MusicChannelInfo";
import MusicPlayer from "./pages/MusicPlayer";
import Search from "./pages/Search";
import Info from "./pages/Info";
import Subscription from "./pages/Subscription";
import SwimlaneMore from "./pages/SwimlaneMore";

/** Remount when channel or user type changes so pre-roll + playback state reset. */
function MusicPlayerRoute() {
  const { channelId } = useParams();
  const { userType } = useUserType();
  return <MusicPlayer key={`${channelId}-${userType}`} />;
}

function AppRoutes() {
  const location = useLocation();
  const hideBottomNav = /^\/music\/[^/]+\/play\/?$/.test(location.pathname);

  return (
    <>
      <VisualAdsHtmlSync />
      <GuestSkipLimitDialog />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upgrade" element={<Subscription />} />
        <Route path="/more/:categoryId" element={<SwimlaneMore />} />
        <Route path="/music/:channelId" element={<MusicChannelInfo />} />
        <Route path="/music/:channelId/play" element={<MusicPlayerRoute />} />
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

/** Route table; `BottomNav` is a sibling of `Routes` (hidden on full-screen music player). */
function App() {
  return (
    <UserTypeProvider>
      <GuestMusicSkipProvider>
        <GuestPrerollGraceProvider>
          <PlaybackProvider>
            <AppRoutes />
          </PlaybackProvider>
        </GuestPrerollGraceProvider>
      </GuestMusicSkipProvider>
    </UserTypeProvider>
  );
}

export default App;
