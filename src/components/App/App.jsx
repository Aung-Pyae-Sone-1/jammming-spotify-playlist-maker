import { useState } from 'react';
import Playlist from '../Playlist/Playlist.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import './App.css'

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

  const [playlistName, setPlaylistName] = useState("My Playlist")
  const [playlistTracks, setPlaylistTracks] = useState([])

  function addTrack(track) {
    setPlaylistTracks((currentTracks) => {
      const trackAlreadyExists = currentTracks.some(
        (currentTrack) => (currentTrack.id === track.id)
      )
      if (trackAlreadyExists) {
        return currentTracks
      }

      return [...currentTracks, track]
    })
  }

  function removeTrack(track) {
    setPlaylistTracks((currentTracks) => {
      return currentTracks.filter((currentTrack) => (currentTrack.id !== track.id))
    })
  }

  function updatePlaylistName(newName) {setPlaylistName(newName)}
  
  return (
    <main>
      <h1>Jammming</h1>
      <SearchBar />

      <div className="workspace">
        <SearchResults searchResults={searchResults} onAdd={addTrack}/>
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
        />
      </div>
    </main>
  )
}

export default App
