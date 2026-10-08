import TrackList from '../TrackList/TrackList.jsx'

function Playlist() {
  return (
    <section className="playlist">
      <input type="text" defaultValue="New Playlist" aria-label="Playlist name" />
      <TrackList />
      <button type="button">Save To Spotify</button>
    </section>
  )
}

export default Playlist
