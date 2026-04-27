import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { UserTypeProvider } from "./context/UserTypeContext";
import Home from "./pages/Home";
import MusicChannelInfo from "./pages/MusicChannelInfo";
import MusicPlayer from "./pages/MusicPlayer";
import Search from "./pages/Search";
import Info from "./pages/Info";
import Subscription from "./pages/Subscription";

function AppRoutes() {
  const location = useLocation();
  const hideBottomNav = /^\/music\/[^/]+\/play\/?$/.test(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upgrade" element={<Subscription />} />
        <Route path="/music/:channelId" element={<MusicChannelInfo />} />
        <Route path="/music/:channelId/play" element={<MusicPlayer />} />
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
