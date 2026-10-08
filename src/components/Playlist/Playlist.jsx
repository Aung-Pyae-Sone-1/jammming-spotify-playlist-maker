import TrackList from '../TrackList/TrackList.jsx'

function Playlist({ playlistName, playlistTracks }) {
  return (
    <section className="playlist">
      <input type="text" defaultValue={playlistName} aria-label="Playlist name" />
      <TrackList tracks={playlistTracks} />
      <button type="button">Save To Spotify</button>
    </section>
  )
}

export default Playlist