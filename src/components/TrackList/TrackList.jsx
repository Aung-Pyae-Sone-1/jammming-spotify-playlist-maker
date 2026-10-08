import Track from '../Track/Track.jsx'

function TrackList({ tracks = [], onAdd, onRemove, isRemoval=false }) {
  return (
    <div className="track-list">
      {tracks.map((track) => (<Track key={track.id} track={track} onAdd={onAdd} onRemove={onRemove} isRemoval={isRemoval} />))}
    </div>
  )
}

export default TrackList
