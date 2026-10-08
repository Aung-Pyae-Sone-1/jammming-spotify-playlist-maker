import TrackList from '../TrackList/TrackList.jsx'

function SearchResults({searchResults}) {
  return (
    <section className="search-results">
      <h2>Results</h2>
      <TrackList tracks={searchResults} />
    </section>
  )
}

export default SearchResults
