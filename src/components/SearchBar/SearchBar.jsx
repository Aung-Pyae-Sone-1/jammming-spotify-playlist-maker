import { useState } from 'react'

function SearchBar({ onSearch, isSearching }) {
  const [term, setTerm] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(term)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="track-search">
        Search for a song
      </label>
      <input
        id="track-search"
        type="search"
        placeholder="Enter a song title"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      <button type="submit" disabled={isSearching || !term.trim()}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar
