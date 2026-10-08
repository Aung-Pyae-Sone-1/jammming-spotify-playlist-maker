import TrackList from '../TrackList/TrackList.jsx'

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange }) {
  function handleNameChange(event) {
    onNameChange(event.target.value)
  }

  return (
    <section className="playlist">
      <input type="text" defaultValue={playlistName} aria-label="Playlist name" onChange={handleNameChange} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button type="button">Save To Spotify</button>
    </section>
  )
}

export default Playlist