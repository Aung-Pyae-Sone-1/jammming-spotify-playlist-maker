import './App.css'
import Playlist from '../Playlist/Playlist.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'

function App() {
  const searchResults = [
  {
    id: 1,
    name: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    uri: 'spotify:track:example1',
  },
  {
    id: 2,
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    uri: 'spotify:track:example2',
  },
  {
    id: 3,
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    uri: 'spotify:track:example3',
  }];

  const playlistName = 'My Playlist';
  const playlistTracks = [searchResults[0],searchResults[2]];

  return (
    <main>
      <h1>Jammming</h1>
      <SearchBar />

      <div className="workspace">
        <SearchResults searchResults={searchResults} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
        />
      </div>
    </main>
  )
}

export default App
