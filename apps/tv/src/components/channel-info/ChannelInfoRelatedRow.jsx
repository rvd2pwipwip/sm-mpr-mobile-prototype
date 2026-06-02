import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import MusicChannelCard from "../cards/MusicChannelCard.jsx";
import "../cards/ContentTileCard.css";
import "../swimlanes/FixedSwimlane.css";
import "../swimlanes/SwimlaneRow.css";

/**
 * Related channels — up to 5 cards in a full-width inset grid (no horizontal scroll).
 */
export default function ChannelInfoRelatedRow({
  channels,
  groupIndex,
  focused = false,
  focusedIndex = 0,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onSelectChannel,
}) {
  const { enterContent } = useTvNavFocus();

  return (
    <section
      className="swimlane-row music-channel-info__related"
      aria-label="Related"
    >
      <h2 className="swimlane-row__title">Related</h2>
      <div className="fixed-swimlane__viewport music-channel-info__related-viewport">
        <div
          className="fixed-swimlane__row fixed-swimlane__row--ready music-channel-info__related-grid"
          role="list"
        >
        {channels.map((channel, index) => (
          <KeyboardWrapper
            key={channel.id}
            ref={(node) => registerItemRef(groupIndex, index, node)}
            selectData={channel}
            onSelect={() => {
              enterContent();
              onSelectChannel?.(channel);
            }}
            onUp={onMoveUp}
            onDown={onMoveDown}
            onLeft={onMoveLeft}
            onRight={onMoveRight}
          >
            {(focusProps) => (
              <MusicChannelCard
                {...focusProps}
                channel={channel}
                focused={focused && focusedIndex === index}
              />
            )}
          </KeyboardWrapper>
        ))}
        </div>
      </div>
    </section>
  );
}
