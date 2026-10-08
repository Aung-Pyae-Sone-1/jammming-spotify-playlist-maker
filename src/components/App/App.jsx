import { useState } from 'react'
import Playlist from '../Playlist/Playlist.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import {
  exchangeCodeForAccessToken,
  isSpotifyConnected,
  redirectToSpotifyAuthorization,
  savePlaylistToSpotify,
  searchTracks,
} from '../../util/Spotify.js'
import { extractTrackUris } from '../../util/spotifyData.js'
import './App.css'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [playlistName, setPlaylistName] = useState('My Playlist')
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [spotifyStatus, setSpotifyStatus] = useState(() =>
    isSpotifyConnected() ? 'connected' : 'disconnected',
  )
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const hasAuthorizationCode = new URLSearchParams(
    window.location.search,
  ).has('code')

  function addTrack(track) {
    setPlaylistTracks((currentTracks) => {
      const trackAlreadyExists = currentTracks.some(
        (currentTrack) => currentTrack.id === track.id,
      )

      return trackAlreadyExists ? currentTracks : [...currentTracks, track]
    })
  }

  function removeTrack(track) {
    setPlaylistTracks((currentTracks) =>
      currentTracks.filter((currentTrack) => currentTrack.id !== track.id),
    )
  }

  function updatePlaylistName(newName) {
    setPlaylistName(newName)
  }

  async function search(term) {
    setError('')
    setMessage('')
    setIsSearching(true)

    try {
      const tracks = await searchTracks(term)
      setSearchResults(tracks)

      if (!tracks.length) {
        setMessage('No tracks found. Try a different search.')
      }
    } catch (searchError) {
      setError(searchError.message)

      if (searchError.message.includes('connect again')) {
        setSpotifyStatus('disconnected')
      }
    } finally {
      setIsSearching(false)
    }
  }

  async function savePlaylist() {
    setError('')
    setMessage('')
    setIsSaving(true)

    try {
      const trackUris = extractTrackUris(playlistTracks)
      const playlist = await savePlaylistToSpotify(playlistName, trackUris)

      setMessage(`“${playlist.name}” was saved to Spotify.`)
      setPlaylistName('New Playlist')
      setPlaylistTracks([])
    } catch (saveError) {
      setError(saveError.message)

      if (saveError.message.includes('connect again')) {
        setSpotifyStatus('disconnected')
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSpotifyConnection() {
    try {
      setError('')
      setMessage('')
      setSpotifyStatus('connecting')

      if (hasAuthorizationCode) {
        const accessToken = await exchangeCodeForAccessToken()
        setSpotifyStatus(accessToken ? 'connected' : 'disconnected')

        if (accessToken) {
          setMessage('Spotify connected successfully.')
        }

        return
      }

      await redirectToSpotifyAuthorization()
    } catch (connectionError) {
      console.error(connectionError)
      setError(connectionError.message)
      setSpotifyStatus('error')
    }
  }

  return (
    <main>
      <h1>Jammming</h1>

      {spotifyStatus === 'connected' ? (
        <p className="connection-status">Spotify connected</p>
      ) : (
        <button
          type="button"
          onClick={handleSpotifyConnection}
          disabled={spotifyStatus === 'connecting'}
        >
          {spotifyStatus === 'connecting'
            ? 'Connecting...'
            : hasAuthorizationCode
              ? 'Complete Spotify Connection'
              : 'Connect Spotify'}
        </button>
      )}

      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <SearchBar onSearch={search} isSearching={isSearching} />

      <div className="workspace">
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
          isSaving={isSaving}
        />
      </div>
    </main>
  )
}

export default App
