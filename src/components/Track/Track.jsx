function Track({ track, onAdd, onRemove, isRemoval=false }) {

  function handleClick() {
    if (isRemoval) {onRemove(track)} 
    else {onAdd(track)}
  }

  const actionLabel = isRemoval ? `Remove ${track.name}` : `Add ${track.name}`

  return (
    <article className="track">
      <div>
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>

      <button type="button" aria-label={actionLabel} onClick={handleClick}>
        {isRemoval ? '-' : '+'}
      </button>
    </article>
  )
}

export default Track;