import { useEffect, useMemo, useState } from "react";
import { resolveRadioStationForStub } from "../../data/radioInternationalBrowse.js";
import ButtonSmall from "../ButtonSmall";
import { useDescriptionClampOverflow } from "../../hooks/useDescriptionClampOverflow";
import { useMusicRadioLikeAction } from "../../hooks/useMusicRadioLikeAction";
import PlayerInfoBottomSheet from "./PlayerInfoBottomSheet";
import "../../pages/MusicChannelInfo.css";
import "../../pages/RadioStationInfo.css";

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

export default function RadioPlayerInfoSheet({
  open,
  onClose,
  stationId,
  playing,
  onTogglePlay,
}) {
  const [descExpanded, setDescExpanded] = useState(false);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;
  const radioLike = useMusicRadioLikeAction("radio", station?.id);

  useEffect(() => {
    if (open) return;
    setDescExpanded(false);
  }, [open, stationId]);

  const metaRows = useMemo(() => {
    if (!station) return [];
    const tags = (station.tags ?? []).filter(Boolean);
    const locationLine =
      station.locationCity && station.locationCountry
        ? `${station.locationCity}, ${station.locationCountry}`
        : (station.frequencyLabel ?? tags[0] ?? station.categoryLabel ?? "—");
    const genresLine =
      tags.length > 0 ? tags.join(", ") : (station.categoryLabel ?? "—");
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

  const { ref: descRef, overflows: descOverflows } = useDescriptionClampOverflow(
    station?.description ?? "",
    !descExpanded,
    open,
  );

  if (!station) return null;

  const titleId = `radio-player-info-sheet-title-${station.id}`;

  return (
    <PlayerInfoBottomSheet
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <div className="music-info__column player-info-bottom-sheet__content">
        <div className="music-info__inset">
          <h2 id={titleId} className="music-info__name">
            {station.name}
          </h2>

          <div className="music-info__hero">
            <div className="music-info__thumb-wrap">
              <img
                className="music-info__thumb"
                src={station.thumbnail}
                alt=""
                width={230}
                height={230}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="music-info__actions-col">
              <ButtonSmall
                variant="cta"
                fullWidth
                startIcon={
                  <ActionIconMask variant={playing ? "pause" : "play"} />
                }
                onClick={onTogglePlay}
              >
                {playing ? "Pause" : "Play"}
              </ButtonSmall>
              <ButtonSmall
                variant="secondary"
                fullWidth
                startIcon={
                  <ActionIconMask variant={radioLike.iconVariant} />
                }
                onClick={radioLike.onPress}
              >
                {radioLike.label}
              </ButtonSmall>
            </div>
          </div>

          <div className="music-info__desc-block">
            <p
              ref={descRef}
              className={
                descExpanded
                  ? "music-info__description"
                  : "music-info__description music-info__description--clamped"
              }
            >
              {station.description}
            </p>
            {descOverflows ? (
              <button
                type="button"
                className="music-info__more"
                onClick={() => setDescExpanded((expanded) => !expanded)}
              >
                {descExpanded ? "Less" : "More..."}
              </button>
            ) : null}
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
    </PlayerInfoBottomSheet>
  );
}
