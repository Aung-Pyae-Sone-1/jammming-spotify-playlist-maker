import Track from '../Track/Track.jsx'

function TrackList({ tracks = [] }) {
  return (
    <div className="track-list">
      {tracks.map((track) => (<Track key={track.id} track={track} />))}
    </div>
  )
}

export default TrackList
