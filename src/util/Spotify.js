import { formatSpotifyTracks } from "./spotifyData.js";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const tokenUrl = "https://accounts.spotify.com/api/token";
const apiBaseUrl = "https://api.spotify.com/v1";
const scopes = ["playlist-modify-public"];

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));

  return randomValues.reduce(
    (result, value) => result + characters[value % characters.length],
    "",
  );
}

async function createCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return window
    .btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function storeTokenData(tokenData) {
  const expiresAt = Date.now() + tokenData.expires_in * 1000;

  window.localStorage.setItem("spotify_access_token", tokenData.access_token);
  window.localStorage.setItem("spotify_token_expires_at", String(expiresAt));

  if (tokenData.refresh_token) {
    window.localStorage.setItem(
      "spotify_refresh_token",
      tokenData.refresh_token,
    );
  }
}

function clearStoredTokens() {
  window.localStorage.removeItem("spotify_access_token");
  window.localStorage.removeItem("spotify_token_expires_at");
  window.localStorage.removeItem("spotify_refresh_token");
}

async function refreshAccessToken() {
  const refreshToken = window.localStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    clearStoredTokens();
    return null;
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    clearStoredTokens();
    throw new Error("Your Spotify session expired. Please connect again.");
  }

  const tokenData = await response.json();
  storeTokenData(tokenData);
  return tokenData.access_token;
}

export function isSpotifyConnected() {
  return Boolean(
    window.localStorage.getItem("spotify_access_token") ||
    window.localStorage.getItem("spotify_refresh_token"),
  );
}

export async function getAccessToken() {
  const accessToken = window.localStorage.getItem("spotify_access_token");
  const expiresAt = Number(
    window.localStorage.getItem("spotify_token_expires_at"),
  );

  if (accessToken && expiresAt > Date.now() + 30_000) {
    return accessToken;
  }

  return refreshAccessToken();
}

async function spotifyFetch(path, options = {}) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Connect Spotify before using this feature.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredTokens();
      throw new Error("Your Spotify session expired. Please connect again.");
    }

    throw new Error(`Spotify request failed with status ${response.status}.`);
  }

  return response.status === 204 ? null : response.json();
}

export async function redirectToSpotifyAuthorization() {
  if (!clientId || !redirectUri) {
    throw new Error("Spotify environment variables are missing.");
  }

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  window.localStorage.setItem("spotify_code_verifier", codeVerifier);
  window.localStorage.setItem("spotify_auth_state", state);

  const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  }).toString();

  window.location.href = authorizationUrl.toString();
}

export async function exchangeCodeForAccessToken() {
  const urlParameters = new URLSearchParams(window.location.search);
  const authorizationError = urlParameters.get("error");
  const authorizationCode = urlParameters.get("code");
  const returnedState = urlParameters.get("state");

  if (authorizationError) {
    throw new Error(`Spotify authorization failed: ${authorizationError}`);
  }

  if (!authorizationCode) {
    return null;
  }

  const savedState = window.localStorage.getItem("spotify_auth_state");
  const codeVerifier = window.localStorage.getItem("spotify_code_verifier");

  if (!returnedState || returnedState !== savedState) {
    throw new Error("Spotify authorization state does not match.");
  }

  if (!codeVerifier) {
    throw new Error("The Spotify PKCE code verifier is missing.");
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Spotify token request failed with status ${response.status}.`,
    );
  }

  const tokenData = await response.json();
  storeTokenData(tokenData);
  window.localStorage.removeItem("spotify_auth_state");
  window.localStorage.removeItem("spotify_code_verifier");
  window.history.replaceState({}, document.title, window.location.pathname);

  return tokenData.access_token;
}

export async function searchTracks(term) {
  const cleanTerm = term.trim();

  if (!cleanTerm) {
    return [];
  }

  const parameters = new URLSearchParams({
    q: cleanTerm,
    type: "track",
    limit: "10",
  });
  const data = await spotifyFetch(`/search?${parameters.toString()}`);

  return formatSpotifyTracks(data.tracks?.items);
}

export async function savePlaylistToSpotify(name, trackUris) {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Enter a playlist name before saving.");
  }

  if (!trackUris.length) {
    throw new Error("Add at least one track before saving.");
  }

  const playlist = await spotifyFetch("/me/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: cleanName,
      public: true,
      description: "Created with Jammming",
    }),
  });

  await spotifyFetch(`/playlists/${playlist.id}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uris: trackUris }),
  });

  return playlist;
}
