import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a stub artist from `src/data/musicArtists.js` (Search only).
 *
 * @param {{ artist: { id: string, name: string, thumbnail?: string }, onSelect?: () => void, compact?: boolean }} props
 */
export default function MusicArtistCard({ artist, onSelect, compact = false }) {
  const imageUrl =
    artist.thumbnail ??
    `https://picsum.photos/seed/${encodeURIComponent(`artist-${artist.id}`)}/512/512`;

  return (
    <ContentTileCard
      title={artist.name}
      subtitle="Artist"
      imageUrl={imageUrl}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
