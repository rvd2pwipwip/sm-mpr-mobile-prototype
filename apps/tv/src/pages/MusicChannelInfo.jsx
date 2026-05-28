import { Navigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import "./MusicChannelInfo.css";

/** Channel Info stub — Phase 4 title + thumbnail; fuller layout in Phase 5. */
export default function MusicChannelInfo() {
  const { channelId } = useParams();
  const channel = channelId ? getMusicChannelById(channelId) : null;

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="tv-page music-channel-info">
      <h1 className="tv-page__title">{channel.name}</h1>
      <div className="music-channel-info__hero">
        <img
          className="music-channel-info__thumb"
          src={channel.thumbnail}
          alt=""
        />
      </div>
      {channel.description ? (
        <p className="music-channel-info__description">{channel.description}</p>
      ) : null}
      <p className="tv-page__lede">
        Channel Info stub. Press Esc to return to Home with focus restored. Play
        and related channels ship in Phase 5.
      </p>
    </div>
  );
}
