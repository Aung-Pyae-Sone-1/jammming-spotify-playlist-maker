import TrackList from '../TrackList/TrackList.jsx'

function Playlist({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
  isSaving,
}) {
  function handleNameChange(event) {
    onNameChange(event.target.value)
  }

  return (
    <section className="playlist">
      <label className="sr-only" htmlFor="playlist-name">
        Playlist name
      </label>
      <input
        id="playlist-name"
        type="text"
        value={playlistName}
        onChange={handleNameChange}
      />
      <TrackList
        tracks={playlistTracks}
        onRemove={onRemove}
        isRemoval={true}
      />
      <button type="button" onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save To Spotify'}
      </button>
    </section>
  )
}

export default Playlist
