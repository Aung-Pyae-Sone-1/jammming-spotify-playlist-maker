import { useState } from "react";

function SearchBar({ onSearch, isSearching, isConnected }) {
  const [term, setTerm] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(term);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="track-search">SEARCH THE CATALOGUE</label>
      <div className="search-control">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="track-search"
          type="search"
          placeholder="Song, artist, or album"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          disabled={!isConnected}
        />
      </div>
      <button
        type="submit"
        disabled={!isConnected || isSearching || !term.trim()}
      >
        {isSearching ? "Searching…" : "Find tracks"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      {!isConnected && (
        <p className="search-hint">Connect Spotify above to start searching.</p>
      )}
    </form>
  );
}

export default SearchBar;
