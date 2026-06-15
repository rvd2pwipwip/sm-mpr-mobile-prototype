import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { GroupFocusNavigationProvider } from "./context/GroupFocusNavigationContext.jsx";
import { ScreenMemoryProvider } from "./context/ScreenMemoryContext.jsx";
import { CategoryRailMemoryProvider } from "./context/CategoryRailMemoryContext.jsx";
import { TerritoryProvider } from "./context/TerritoryContext.jsx";
import { ContentProfileProvider } from "./context/ContentProfileContext.jsx";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext.jsx";
import { AccountRequiredDialogProvider } from "./context/AccountRequiredDialogContext.jsx";
import { GuestPrerollGraceProvider } from "./context/GuestPrerollGraceContext.jsx";
import { GuestMusicSkipProvider } from "./context/GuestMusicSkipContext.jsx";
import { LikesProvider } from "./context/LikesContext.jsx";
import { PlaybackProvider } from "./context/PlaybackContext.jsx";
import { LimitedHomeEscProvider } from "./context/LimitedHomeEscContext.jsx";
import { TvNavFocusProvider } from "./context/TvNavFocusContext.jsx";
import GlobalTvKeys from "./components/focus/GlobalTvKeys.jsx";
import TvAccountRequiredDialog from "./components/player/TvAccountRequiredDialog.jsx";
import TvGuestSkipLimitDialog from "./components/player/TvGuestSkipLimitDialog.jsx";
import TvViewport from "./components/TvViewport.jsx";
import TvShell from "./components/TvShell.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import SearchIndexRedirect from "./routes/SearchIndexRedirect.jsx";
import { PodcastUserStateProvider } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { ListenHistoryProvider } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import RequireContentType from "./components/RequireContentType.jsx";
import TvContentTypeUnavailable from "./pages/TvContentTypeUnavailable.jsx";
import PodcastInfo from "./pages/PodcastInfo.jsx";
import PodcastPlayer from "./pages/PodcastPlayer.jsx";
import SearchMusicBroadTagChannels from "./pages/SearchMusicBroadTagChannels.jsx";
import SearchMusicCategory from "./pages/SearchMusicCategory.jsx";
import SearchMusicVibe from "./pages/SearchMusicVibe.jsx";
import SearchPodcastsCategory from "./pages/SearchPodcastsCategory.jsx";
import SearchPodcastsLibrary from "./pages/SearchPodcastsLibrary.jsx";
import SearchMusicArtistChannels from "./pages/SearchMusicArtistChannels.jsx";
import SearchRadioInternational from "./pages/SearchRadioInternational.jsx";
import SearchRadioStationGrid from "./pages/SearchRadioStationGrid.jsx";
import TvSearchCatalogMore from "./pages/TvSearchCatalogMore.jsx";
import TvSearchRouteStub from "./pages/TvSearchRouteStub.jsx";
import TvSearchTagsMore from "./pages/TvSearchTagsMore.jsx";
import MyLibrary from "./pages/MyLibrary.jsx";
import MyLibraryHistoryMore from "./pages/MyLibraryHistoryMore.jsx";
import MyLibraryLikesMore from "./pages/MyLibraryLikesMore.jsx";
import FocusDemo from "./pages/FocusDemo.jsx";
import MusicChannelInfo from "./pages/MusicChannelInfo.jsx";
import MusicPlayer from "./pages/MusicPlayer.jsx";
import SwimlaneMore from "./pages/SwimlaneMore.jsx";
import ListenAgainMore from "./pages/ListenAgainMore.jsx";
import TvUserTypePreview from "./pages/TvUserTypePreview.jsx";

/** Remount when channel or user type changes so preroll + transport reset. */
function MusicPlayerRoute() {
  const { channelId } = useParams();
  const { userType } = useUserType();
  return <MusicPlayer key={`${channelId}-${userType}`} />;
}

/** Remount when show, episode, or user type changes so preroll + transport reset. */
function PodcastPlayerRoute() {
  const { podcastId, episodeId } = useParams();
  const { userType } = useUserType();
  return (
    <PodcastPlayer key={`${podcastId}-${episodeId}-${userType}`} />
  );
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
                <ListenHistoryProvider>
                <PodcastUserStateProvider>
                <PlaybackProvider>
                  <TerritoryProvider>
                    <CategoryRailMemoryProvider>
                    <ScreenMemoryProvider>
                      <GroupFocusNavigationProvider>
                        <TvNavFocusProvider>
                          <LimitedHomeEscProvider>
                          <GlobalTvKeys />
                          <TvAccountRequiredDialog />
                          <TvGuestSkipLimitDialog />
                          <TvShell>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/search" element={<SearchIndexRedirect />} />
                              <Route path="/search/music" element={<Search />} />
                              <Route path="/search/podcasts" element={<Search />} />
                              <Route path="/search/radio" element={<Search />} />
                              <Route
                                path="/search/browse/music/vibe/:vibeId/tag/:tagSlug/sub/:subSlug"
                                element={<SearchMusicBroadTagChannels />}
                              />
                              <Route
                                path="/search/browse/music/vibe/:vibeId/tag/:tagSlug"
                                element={<SearchMusicBroadTagChannels />}
                              />
                              <Route
                                path="/search/browse/music/vibe/:vibeId"
                                element={<SearchMusicVibe />}
                              />
                              <Route
                                path="/search/browse/music/category/:categoryId"
                                element={<SearchMusicCategory />}
                              />
                              <Route
                                path="/search/browse/music/artist/:artistId"
                                element={<SearchMusicArtistChannels />}
                              />
                              <Route
                                path="/search/browse/podcasts/library/:librarySection"
                                element={
                                  <RequireContentType type={CONTENT_TYPE.podcasts}>
                                    <SearchPodcastsLibrary />
                                  </RequireContentType>
                                }
                              />
                              <Route
                                path="/search/browse/podcasts/category/:categoryId"
                                element={<SearchPodcastsCategory />}
                              />
                              <Route
                                path="/search/browse/radio/near-you"
                                element={<SearchRadioStationGrid />}
                              />
                              <Route
                                path="/search/browse/radio/format/:formatId"
                                element={<SearchRadioStationGrid />}
                              />
                              <Route
                                path="/search/browse/radio/international/*"
                                element={<SearchRadioInternational />}
                              />
                              <Route
                                path="/search/browse/radio/international"
                                element={<SearchRadioInternational />}
                              />
                              <Route
                                path="/search/browse/*"
                                element={<TvSearchRouteStub title="Search browse" />}
                              />
                              <Route
                                path="/search/more/catalog"
                                element={<TvSearchCatalogMore />}
                              />
                              <Route
                                path="/search/more/tags"
                                element={<TvSearchTagsMore />}
                              />
                              <Route
                                path="/podcast/:podcastId"
                                element={
                                  <RequireContentType contentType={CONTENT_TYPE.podcasts}>
                                    <PodcastInfo />
                                  </RequireContentType>
                                }
                              />
                              <Route
                                path="/podcast/:podcastId/play/:episodeId"
                                element={
                                  <RequireContentType contentType={CONTENT_TYPE.podcasts}>
                                    <PodcastPlayerRoute />
                                  </RequireContentType>
                                }
                              />
                              <Route
                                path="/radio/:stationId"
                                element={
                                  <TvContentTypeUnavailable contentLabel="Radio" />
                                }
                              />
                              <Route path="/my-library" element={<MyLibrary />} />
                              <Route
                                path="/my-library/history/:historySegment"
                                element={<MyLibraryHistoryMore />}
                              />
                              <Route
                                path="/my-library/likes/:likeKind"
                                element={<MyLibraryLikesMore />}
                              />
                              <Route
                                path="/info/contact"
                                element={<TvSearchRouteStub title="Contact us" />}
                              />
                              <Route
                                path="/info/about"
                                element={<TvSearchRouteStub title="About" />}
                              />
                              <Route path="/focus-demo" element={<FocusDemo />} />
                              <Route path="/music/:channelId" element={<MusicChannelInfo />} />
                              <Route
                                path="/music/:channelId/play"
                                element={<MusicPlayerRoute />}
                              />
                              <Route
                                path="/more/listen-again"
                                element={<ListenAgainMore />}
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
                          </LimitedHomeEscProvider>
                        </TvNavFocusProvider>
                      </GroupFocusNavigationProvider>
                    </ScreenMemoryProvider>
                    </CategoryRailMemoryProvider>
                  </TerritoryProvider>
                </PlaybackProvider>
                </PodcastUserStateProvider>
                </ListenHistoryProvider>
              </LikesProvider>
            </GuestPrerollGraceProvider>
          </GuestMusicSkipProvider>
        </AccountRequiredDialogProvider>
        </ContentProfileProvider>
      </UserTypeProvider>
    </TvViewport>
  );
}
