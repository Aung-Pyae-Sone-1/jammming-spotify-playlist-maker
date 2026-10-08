import Track from "../Track/Track.jsx";

function TrackList({
  tracks = [],
  onAdd,
  onRemove,
  isRemoval = false,
  selectedIds,
}) {
  return (
    <div className="track-list">
      {tracks.map((track, index) => (
        <Track
          key={track.id}
          track={track}
          index={index}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
          isSelected={selectedIds?.has(track.id) || false}
        />
      ))}
    </div>
  );
}

export default TrackList;
