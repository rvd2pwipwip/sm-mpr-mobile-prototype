import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ButtonSmall from "../components/ButtonSmall";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";
import "./MusicChannelInfo.css";
import "./RadioStationInfo.css";

/** Icons — `public/*.svg` via CSS mask (`MusicChannelInfo.css`). */
function ActionIconMask({ variant }) {
  return (
    <span
      className={[
        "music-info__action-icon-mask",
        `music-info__action-icon-mask--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/**
 * Radio station detail — Figma `radioInfo` `19622:30844`.
 * Layout mirrors `MusicChannelInfo` / `PodcastInfo` (hero + actions + description + metadata).
 */
export default function RadioStationInfo() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [descExpanded, setDescExpanded] = useState(false);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;

  const metaRows = useMemo(() => {
    if (!station) return [];
    const tags = (station.tags ?? []).filter(Boolean);
    const locationLine =
      station.locationCity && station.locationCountry
        ? `${station.locationCity}, ${station.locationCountry}`
        : station.frequencyLabel ?? tags[0] ?? station.categoryLabel ?? "—";
    const genresLine =
      tags.length > 0 ? tags.join(", ") : station.categoryLabel ?? "—";
    return [
      { label: "Location", value: locationLine },
      { label: "Genres", value: genresLine },
      { label: "Language", value: "English (prototype)" },
      {
        label: "Website",
        value: "stingray.com",
        href: "https://www.stingray.com",
      },
    ];
  }, [station]);

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  const goBack = () => navigate(-1);
  const goPlay = () =>
    navigate(`/radio/${station.id}/play`, {
      replace: true,
      state: playOverDetailNavigateState(),
    });

  return (
    <main className="app-shell app-shell--footer-fixed music-info">
      <ScreenHeader
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="music-info__scroll">
        <div className="music-info__column">
          <div className="music-info__inset">
            <h1 className="music-info__name">{station.name}</h1>

            <div className="music-info__hero">
              <div className="music-info__thumb-wrap">
                <img
                  className="music-info__thumb"
                  src={station.thumbnail}
                  alt=""
                  width={230}
                  height={230}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="music-info__actions-col">
                <ButtonSmall
                  variant="cta"
                  fullWidth
                  startIcon={<ActionIconMask variant="play" />}
                  onClick={goPlay}
                >
                  Play
                </ButtonSmall>
                <ButtonSmall
                  variant="secondary"
                  fullWidth
                  startIcon={<ActionIconMask variant="like" />}
                >
                  Like
                </ButtonSmall>
                <ButtonSmall
                  variant="secondary"
                  fullWidth
                  startIcon={<ActionIconMask variant="share" />}
                >
                  Share
                </ButtonSmall>
              </div>
            </div>

            <div className="music-info__desc-block">
              <p
                className={
                  descExpanded
                    ? "music-info__description"
                    : "music-info__description music-info__description--clamped"
                }
              >
                {station.description}
              </p>
              <button
                type="button"
                className="music-info__more"
                onClick={() => setDescExpanded((e) => !e)}
              >
                {descExpanded ? "Less" : "More..."}
              </button>
            </div>
          </div>

          {metaRows.length > 0 ? (
            <section
              className="radio-info__meta-section"
              aria-label="Station details"
            >
              <dl className="radio-info__meta">
                {metaRows.map((row) => (
                  <div key={row.label} className="radio-info__meta-row">
                    <dt className="radio-info__meta-label">{row.label}</dt>
                    <dd className="radio-info__meta-value">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="radio-info__meta-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
