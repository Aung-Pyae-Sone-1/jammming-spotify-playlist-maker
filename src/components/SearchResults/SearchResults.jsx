import TrackList from "../TrackList/TrackList.jsx";

function SearchResults({
  searchResults,
  selectedIds,
  onAdd,
  hasSearched,
  isSearching,
}) {
  return (
    <section className="search-results">
      <div className="list-heading">
        <h3>Search results</h3>
        <span>
          {searchResults.length
            ? `${searchResults.length} TRACKS`
            : "DISCOVERY"}
        </span>
      </div>
      {searchResults.length ? (
        <TrackList
          tracks={searchResults}
          onAdd={onAdd}
          selectedIds={selectedIds}
        />
      ) : (
        <div className="empty-results">
          <span className="empty-glyph" aria-hidden="true">
            ✳
          </span>
          <p>
            {isSearching
              ? "Looking for your next favorite song…"
              : hasSearched
                ? "No matches yet. Try another song or artist."
                : "Your next favorite track starts here."}
          </p>
          {!hasSearched && (
            <small>Search above to explore the catalogue.</small>
          )}
        </div>
      )}
    </section>
  );
}

export default SearchResults;
