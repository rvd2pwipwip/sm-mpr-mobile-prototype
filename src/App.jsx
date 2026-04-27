import { Routes, Route, useLocation, useParams } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
import Home from "./pages/Home";
import MusicChannelInfo from "./pages/MusicChannelInfo";
import MusicPlayer from "./pages/MusicPlayer";
import Search from "./pages/Search";
import Info from "./pages/Info";
import Subscription from "./pages/Subscription";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upgrade" element={<Subscription />} />
        <Route path="/music/:channelId" element={<MusicChannelInfo />} />
        <Route path="/music/:channelId/play" element={<MusicPlayerRoute />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<Info />} />
      </Routes>
      {hideBottomNav ? null : <BottomNav />}
    </>
  );
}

/** Route table; `BottomNav` is a sibling of `Routes` (hidden on full-screen music player). */
function App() {
  return (
    <UserTypeProvider>
      <AppRoutes />
    </UserTypeProvider>
  );
}

export default App;
