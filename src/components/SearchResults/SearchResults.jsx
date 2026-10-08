import TrackList from '../TrackList/TrackList.jsx'

function SearchResults({ searchResults, onAdd }) {
  return (
    <section className="search-results">
      <h2>Results</h2>
      <TrackList tracks={searchResults} onAdd={onAdd} />
    </section>
  )
}

export default SearchResults
