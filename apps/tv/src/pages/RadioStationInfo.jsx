import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import ChannelInfoDescription from "../components/channel-info/ChannelInfoDescription.jsx";
import ChannelInfoDescriptionDialog from "../components/channel-info/ChannelInfoDescriptionDialog.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvButton from "../components/TvButton.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";
import { useDescriptionClampOverflow } from "../hooks/useDescriptionClampOverflow.js";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import "./RadioStationInfo.css";

const PLAY_ACTION = 0;
const LIKE_ACTION = 1;

/**
 * Radio station detail — in-car Figma `radioInfo` `13524:34458`.
 * Hero + Play/Like actions + description + metadata row (no Share on TV).
 */
export default function RadioStationInfo() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;
  const radioLike = useMusicRadioLikeAction("radio", station?.id);

  const descriptionText = station?.description ?? "";
  const hasDescription = Boolean(descriptionText);
  const { ref: descriptionRef, overflows: descriptionOverflows } =
    useDescriptionClampOverflow(descriptionText, hasDescription);

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
      { label: "Website", value: "stingray.com" },
    ];
  }, [station]);

  const {
    descriptionGroup,
    actionsGroup,
    groupCount,
    itemCounts,
    defaultGroupIndex,
  } = useMemo(() => {
    const counts = {};
    let next = 0;
    let descG = null;
    if (hasDescription && descriptionOverflows) {
      descG = next;
      counts[descG] = 1;
      next += 1;
    }
    const actG = next;
    counts[actG] = 2;
    next += 1;
    return {
      descriptionGroup: descG,
      actionsGroup: actG,
      groupCount: next,
      itemCounts: counts,
      defaultGroupIndex: actG,
    };
  }, [hasDescription, descriptionOverflows]);

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    enterNavFromContent,
  } = useScreenContentFocus(`radio-info-${stationId}`, {
    groupCount,
    itemCounts,
    swimlaneGroups: [],
    defaultGroupIndex,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
    contentKeysEnabled: !descriptionDialogOpen,
    suspendDomFocus: descriptionDialogOpen,
  });

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  const goPlay = () => {
    enterContent();
    navigate(`/radio/${station.id}/play`, { replace: true });
  };

  return (
    <div className="tv-page radio-station-info">
      <div className="radio-station-info__stack">
        <div className="radio-station-info__hero">
          <div className="radio-station-info__thumb-wrap">
            <img
              className="radio-station-info__thumb"
              src={station.thumbnail}
              alt=""
            />
          </div>

          <div className="radio-station-info__details">
            <div className="radio-station-info__copy">
              <h1 className="radio-station-info__title tv-screen-header-title">
                {station.name}
              </h1>

              {hasDescription ? (
                <div className="radio-station-info__description-block">
                  {descriptionGroup != null ? (
                    <ChannelInfoDescription
                      text={descriptionText}
                      descriptionRef={descriptionRef}
                      overflows={descriptionOverflows}
                      groupIndex={descriptionGroup}
                      focused={isItemFocused(descriptionGroup, 0)}
                      registerItemRef={registerItemRef}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onSelect={() => setDescriptionDialogOpen(true)}
                    />
                  ) : (
                    <p className="radio-station-info__description">
                      {descriptionText}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="radio-station-info__actions-row">
              <KeyboardWrapper
                ref={(node) => registerItemRef(actionsGroup, PLAY_ACTION, node)}
                onSelect={goPlay}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onLeft={enterNavFromContent}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <TvButton
                    {...focusProps}
                    focused={isItemFocused(actionsGroup, PLAY_ACTION)}
                    iconSrc="/play.svg"
                    label="Play"
                  />
                )}
              </KeyboardWrapper>

              <KeyboardWrapper
                ref={(node) => registerItemRef(actionsGroup, LIKE_ACTION, node)}
                onSelect={() => radioLike.onPress()}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onLeft={handleMoveLeft}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <TvButton
                    {...focusProps}
                    variant="secondary"
                    focused={isItemFocused(actionsGroup, LIKE_ACTION)}
                    iconMaskVariant={radioLike.iconVariant}
                    label={radioLike.label}
                    ariaLabel={radioLike.ariaLabel}
                  />
                )}
              </KeyboardWrapper>
            </div>
          </div>
        </div>

        {metaRows.length > 0 ? (
          <section
            className="radio-station-info__meta"
            aria-label="Station details"
          >
            {metaRows.map((row) => (
              <div key={row.label} className="radio-station-info__meta-item">
                <p className="radio-station-info__meta-label">{row.label}</p>
                <p className="radio-station-info__meta-value">{row.value}</p>
              </div>
            ))}
          </section>
        ) : null}
      </div>

      <ChannelInfoDescriptionDialog
        open={descriptionDialogOpen}
        channelName={station.name}
        description={descriptionText}
        onClose={() => setDescriptionDialogOpen(false)}
      />
    </div>
  );
}
