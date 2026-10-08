function Track({ track }) {
  return (
    <article className="track">
      <div>
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>

      <button type="button" aria-label={`Add ${track.name}`}>
        +
      </button>
    </article>
  )
}

export default Track;