import TrackList from "../TrackList/TrackList.jsx";

function Playlist({
  className = "",
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
  isSaving,
  isConnected,
}) {
  function handleNameChange(event) {
    onNameChange(event.target.value);
  }

  const artwork = playlistTracks
    .map((track) => track.artwork)
    .filter(Boolean)
    .slice(0, 4);
  const totalDurationMs = playlistTracks.reduce(
    (total, track) => total + (track.durationMs || 0),
    0,
  );
  const totalMinutes = Math.ceil(totalDurationMs / 60000);

  return (
    <section className={`playlist ${className}`} aria-label="Your mix">
      <div className="panel-topline">
        <span>02 / CREATE</span>
        <span className="panel-symbol" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="mix-cover" aria-label="Artwork for your mix">
        {artwork.length > 0 && (
          <div
            className={`cover-mosaic cover-mosaic-${artwork.length}`}
            aria-hidden="true"
          >
            {artwork.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" />
            ))}
          </div>
        )}
        <div className="cover-overlay">
          <span className="cover-label">JAMMMING / MIX NO. 001</span>
          <span className="cover-star" aria-hidden="true">
            ✳
          </span>
          <span className="cover-title">
            {playlistName.trim() || "Untitled mix"}
          </span>
          <span className="cover-bottom">
            CURATED BY YOU <span>↗</span>
          </span>
        </div>
      </div>

      <div className="mix-details">
        <div className="mix-heading">
          <div>
            <p className="section-kicker">YOUR MIX</p>
            <h2>
              Make it yours<span className="accent-period">.</span>
            </h2>
          </div>
          <span className="mix-count">
            {String(playlistTracks.length).padStart(2, "0")}
          </span>
        </div>
        <label htmlFor="playlist-name">GIVE YOUR MIX A NAME</label>
        <input
          id="playlist-name"
          type="text"
          value={playlistName}
          onChange={handleNameChange}
          placeholder="Name your mix"
          maxLength={100}
        />
        <div className="mix-track-heading">
          <span>TRACKLIST</span>
          <span>
            {playlistTracks.length}{" "}
            {playlistTracks.length === 1 ? "TRACK" : "TRACKS"}
            {totalMinutes > 0 ? ` · ${totalMinutes} MIN` : ""}
          </span>
        </div>
        {playlistTracks.length ? (
          <TrackList
            tracks={playlistTracks}
            onRemove={onRemove}
            isRemoval={true}
          />
        ) : (
          <div className="empty-mix">
            <span aria-hidden="true">↖</span>
            <p>Your mix starts with a song.</p>
            <small>Find something you love and add it here.</small>
          </div>
        )}
        <button
          className="save-button"
          type="button"
          onClick={onSave}
          disabled={
            isSaving ||
            !isConnected ||
            !playlistTracks.length ||
            !playlistName.trim()
          }
        >
          {isSaving ? "Saving your mix…" : "Save to Spotify"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="save-note">
          {!isConnected
            ? "Connect Spotify to save your mix."
            : "Your playlist will be added to your Spotify library."}
        </p>
      </div>
    </section>
  );
}

export default Playlist;
