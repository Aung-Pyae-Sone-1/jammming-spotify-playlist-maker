function Track({
  track,
  index,
  onAdd,
  onRemove,
  isRemoval = false,
  isSelected = false,
}) {
  function handleClick() {
    if (isRemoval) {
      onRemove(track);
    } else {
      onAdd(track);
    }
  }

  const actionLabel = isRemoval
    ? `Remove ${track.name}`
    : isSelected
      ? `${track.name} already in your mix`
      : `Add ${track.name} to your mix`;

  const duration = track.durationMs
    ? `${Math.floor(track.durationMs / 60000)}:${String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, "0")}`
    : null;

  return (
    <article className="track">
      {isRemoval && (
        <span className="track-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div className="track-art" aria-hidden="true">
        {track.artwork ? (
          <img src={track.artwork} alt="" loading="lazy" />
        ) : (
          <span>✳</span>
        )}
      </div>
      <div className="track-info">
        <h4>{track.name}</h4>
        <p>
          {track.artist} <span>·</span> {track.album}
        </p>
      </div>
      {duration && <span className="track-duration">{duration}</span>}
      <button
        className={`track-action ${isSelected && !isRemoval ? "is-selected" : ""}`}
        type="button"
        aria-label={actionLabel}
        onClick={handleClick}
        disabled={isSelected && !isRemoval}
      >
        {isRemoval ? "−" : isSelected ? "✓" : "+"}
      </button>
    </article>
  );
}

export default Track;
