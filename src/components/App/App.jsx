import { useState } from "react";
import Playlist from "../Playlist/Playlist.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import SearchResults from "../SearchResults/SearchResults.jsx";
import {
  exchangeCodeForAccessToken,
  isSpotifyConnected,
  redirectToSpotifyAuthorization,
  savePlaylistToSpotify,
  searchTracks,
} from "../../util/Spotify.js";
import { extractTrackUris } from "../../util/spotifyData.js";
import "./App.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [spotifyStatus, setSpotifyStatus] = useState(() =>
    isSpotifyConnected() ? "connected" : "disconnected",
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeView, setActiveView] = useState("discover");
  const [savedPlaylistUrl, setSavedPlaylistUrl] = useState("");

  const hasAuthorizationCode = new URLSearchParams(window.location.search).has(
    "code",
  );

  function addTrack(track) {
    setPlaylistTracks((currentTracks) => {
      const trackAlreadyExists = currentTracks.some(
        (currentTrack) => currentTrack.id === track.id,
      );

      return trackAlreadyExists ? currentTracks : [...currentTracks, track];
    });
  }

  function removeTrack(track) {
    setPlaylistTracks((currentTracks) =>
      currentTracks.filter((currentTrack) => currentTrack.id !== track.id),
    );
  }

  function updatePlaylistName(newName) {
    setPlaylistName(newName);
  }

  async function search(term) {
    setError("");
    setMessage("");
    setSavedPlaylistUrl("");
    setIsSearching(true);
    setHasSearched(true);

    try {
      const tracks = await searchTracks(term);
      setSearchResults(tracks);

      if (!tracks.length) {
        setMessage("No tracks found. Try a different search.");
      }
    } catch (searchError) {
      setError(searchError.message);

      if (searchError.message.toLowerCase().includes("connect")) {
        setSpotifyStatus("disconnected");
      }
    } finally {
      setIsSearching(false);
    }
  }

  async function savePlaylist() {
    setError("");
    setMessage("");
    setIsSaving(true);
    setSavedPlaylistUrl("");

    try {
      const trackUris = extractTrackUris(playlistTracks);
      const playlist = await savePlaylistToSpotify(playlistName, trackUris);

      setMessage(`“${playlist.name}” was saved to Spotify.`);
      setSavedPlaylistUrl(playlist.external_urls?.spotify || "");
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    } catch (saveError) {
      setError(saveError.message);

      if (saveError.message.toLowerCase().includes("connect")) {
        setSpotifyStatus("disconnected");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSpotifyConnection() {
    try {
      setError("");
      setMessage("");
      setSpotifyStatus("connecting");

      if (hasAuthorizationCode) {
        const accessToken = await exchangeCodeForAccessToken();
        setSpotifyStatus(accessToken ? "connected" : "disconnected");

        if (accessToken) {
          setMessage("Spotify connected successfully.");
        }

        return;
      }

      await redirectToSpotifyAuthorization();
    } catch (connectionError) {
      console.error(connectionError);
      setError(connectionError.message);
      setSpotifyStatus("error");
    }
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand" aria-label="Jammming">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>
            jammming<span className="brand-dot">.</span>
          </span>
        </div>
        {spotifyStatus === "connected" ? (
          <span className="connection-status">
            <span className="status-light" /> Spotify connected
          </span>
        ) : (
          <button
            className="connect-button"
            type="button"
            onClick={handleSpotifyConnection}
            disabled={spotifyStatus === "connecting"}
          >
            {spotifyStatus === "connecting"
              ? "Connecting…"
              : hasAuthorizationCode
                ? "Complete connection"
                : "Connect Spotify"}
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </header>

      <section className="intro" aria-labelledby="intro-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" /> THE MIXROOM / 001
          </p>
          <h1 id="intro-heading">
            Make a mix that <em>feels like you.</em>
          </h1>
          <p className="intro-copy">
            Find the songs, shape the mood, and send your mix straight to
            Spotify.
          </p>
        </div>
        <div className="intro-ornament" aria-hidden="true">
          <span>✳</span>
        </div>
      </section>

      {(message || error) && (
        <div
          className={`notice ${error ? "notice-error" : "notice-success"}`}
          role={error ? "alert" : "status"}
        >
          <span aria-hidden="true">{error ? "!" : "✓"}</span>
          <p>{error || message}</p>
          {savedPlaylistUrl && !error && (
            <a href={savedPlaylistUrl} target="_blank" rel="noreferrer">
              Open in Spotify ↗
            </a>
          )}
        </div>
      )}

      <nav className="mobile-view-switch" aria-label="Workspace view">
        <button
          type="button"
          className={activeView === "discover" ? "active" : ""}
          onClick={() => setActiveView("discover")}
        >
          Find music
        </button>
        <button
          type="button"
          className={activeView === "mix" ? "active" : ""}
          onClick={() => setActiveView("mix")}
        >
          Your mix <span>{playlistTracks.length}</span>
        </button>
      </nav>

      <div className="workspace">
        <section
          className={`discovery-panel ${activeView === "discover" ? "view-active" : ""}`}
          aria-label="Find music"
        >
          <div className="panel-topline">
            <span>01 / DISCOVER</span>
            <span className="panel-symbol" aria-hidden="true">
              ↘
            </span>
          </div>
          <h2>
            Find your sound<span className="accent-period">.</span>
          </h2>
          <p className="panel-description">
            The first track is the start of a story. What are you in the mood
            for?
          </p>
          <SearchBar
            onSearch={search}
            isSearching={isSearching}
            isConnected={spotifyStatus === "connected"}
          />
          <SearchResults
            searchResults={searchResults}
            selectedIds={new Set(playlistTracks.map((track) => track.id))}
            onAdd={addTrack}
            hasSearched={hasSearched}
            isSearching={isSearching}
          />
        </section>

        <Playlist
          className={activeView === "mix" ? "view-active" : ""}
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
          isSaving={isSaving}
          isConnected={spotifyStatus === "connected"}
        />
      </div>

      <footer className="site-footer">
        <span>MADE TO BE PLAYED LOUD</span>
        <span>YOUR MUSIC, YOUR MOMENT.</span>
      </footer>
    </main>
  );
}

export default App;
