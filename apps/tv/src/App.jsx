import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { GroupFocusNavigationProvider } from "./context/GroupFocusNavigationContext.jsx";
import { ScreenMemoryProvider } from "./context/ScreenMemoryContext.jsx";
import { TerritoryProvider } from "./context/TerritoryContext.jsx";
import { ContentProfileProvider } from "./context/ContentProfileContext.jsx";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext.jsx";
import { AccountRequiredDialogProvider } from "./context/AccountRequiredDialogContext.jsx";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext.jsx";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext.jsx";
import { LikesProvider } from "./context/LikesContext.jsx";
import { PlaybackProvider } from "./context/PlaybackContext.jsx";
import { TvNavFocusProvider } from "./context/TvNavFocusContext.jsx";
import GlobalTvKeys from "./components/focus/GlobalTvKeys.jsx";
import TvAccountRequiredDialog from "./components/player/TvAccountRequiredDialog.jsx";
import TvGuestSkipLimitDialog from "./components/player/TvGuestSkipLimitDialog.jsx";
import TvViewport from "./components/TvViewport.jsx";
import TvShell from "./components/TvShell.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import MyLibrary from "./pages/MyLibrary.jsx";
import FocusDemo from "./pages/FocusDemo.jsx";
import MusicChannelInfo from "./pages/MusicChannelInfo.jsx";
import MusicPlayer from "./pages/MusicPlayer.jsx";
import SwimlaneMore from "./pages/SwimlaneMore.jsx";
import TvUserTypePreview from "./pages/TvUserTypePreview.jsx";

/** Remount when channel or user type changes so preroll + transport reset. */
function MusicPlayerRoute() {
  const { channelId } = useParams();
  const { userType } = useUserType();
  return <MusicPlayer key={`${channelId}-${userType}`} />;
}

export default function App() {
  return (
    <TvViewport>
      <UserTypeProvider>
        <ContentProfileProvider>
        <AccountRequiredDialogProvider>
          <GuestMusicSkipProvider>
            <GuestPrerollGraceProvider>
              <LikesProvider>
                <PlaybackProvider>
                  <TerritoryProvider>
                    <ScreenMemoryProvider>
                      <GroupFocusNavigationProvider>
                        <TvNavFocusProvider>
                          <GlobalTvKeys />
                          <TvAccountRequiredDialog />
                          <TvGuestSkipLimitDialog />
                          <TvShell>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/my-library" element={<MyLibrary />} />
                              <Route path="/focus-demo" element={<FocusDemo />} />
                              <Route path="/music/:channelId" element={<MusicChannelInfo />} />
                              <Route
                                path="/music/:channelId/play"
                                element={<MusicPlayerRoute />}
                              />
                              <Route path="/more/music/:categoryId?" element={<SwimlaneMore />} />
                              <Route
                                path="/more/recommendations"
                                element={<SwimlaneMore />}
                              />
                              <Route
                                path="/more/new-releases"
                                element={<SwimlaneMore />}
                              />
                              <Route
                                path="/more/country-essentials"
                                element={<SwimlaneMore />}
                              />
                              <Route path="/settings/user-type" element={<TvUserTypePreview />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                          </TvShell>
                        </TvNavFocusProvider>
                      </GroupFocusNavigationProvider>
                    </ScreenMemoryProvider>
                  </TerritoryProvider>
                </PlaybackProvider>
              </LikesProvider>
            </GuestPrerollGraceProvider>
          </GuestMusicSkipProvider>
        </AccountRequiredDialogProvider>
        </ContentProfileProvider>
        {/*
          Footer ad + scroll reserve: limited catalog only (TvShell mounts
          TvFooterAdBanner + TvVisualAdsHtmlSync). Broad Home uses in-feed banner.
        */}
      </UserTypeProvider>
    </TvViewport>
  );
}
