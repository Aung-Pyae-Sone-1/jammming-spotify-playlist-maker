import './App.css'
import Playlist from '../Playlist/Playlist.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'

function App() {
  return (
    <main>
      <h1>Jammming</h1>
      <SearchBar />

      <div className="workspace">
        <SearchResults />
        <Playlist />
      </div>
    </main>
  )
}

export default App
