import { Routes, Route, Navigate } from "react-router-dom";
import { GroupFocusNavigationProvider } from "./context/GroupFocusNavigationContext.jsx";
import { ScreenMemoryProvider } from "./context/ScreenMemoryContext.jsx";
import { TerritoryProvider } from "./context/TerritoryContext.jsx";
import { TvNavFocusProvider } from "./context/TvNavFocusContext.jsx";
import GlobalTvKeys from "./components/focus/GlobalTvKeys.jsx";
import TvViewport from "./components/TvViewport.jsx";
import TvShell from "./components/TvShell.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import MyLibrary from "./pages/MyLibrary.jsx";
import FocusDemo from "./pages/FocusDemo.jsx";
import MusicChannelInfo from "./pages/MusicChannelInfo.jsx";
import SwimlaneMore from "./pages/SwimlaneMore.jsx";

export default function App() {
  return (
    <TvViewport>
      <TerritoryProvider>
        <ScreenMemoryProvider>
          <GroupFocusNavigationProvider>
            <TvNavFocusProvider>
              <GlobalTvKeys />
              <TvShell>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/my-library" element={<MyLibrary />} />
                  <Route path="/focus-demo" element={<FocusDemo />} />
                  <Route path="/music/:channelId" element={<MusicChannelInfo />} />
                  <Route path="/more/music" element={<SwimlaneMore />} />
                  <Route
                    path="/more/recommendations"
                    element={<SwimlaneMore />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </TvShell>
            </TvNavFocusProvider>
          </GroupFocusNavigationProvider>
        </ScreenMemoryProvider>
      </TerritoryProvider>
    </TvViewport>
  );
}
