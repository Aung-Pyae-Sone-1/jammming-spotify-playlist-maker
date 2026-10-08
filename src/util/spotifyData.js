export function formatSpotifyTracks(items = []) {
  return items.map((track) => ({
    id: track.id,
    name: track.name,
    artist:
      track.artists?.map((artist) => artist.name).join(", ") ||
      "Unknown artist",
    album: track.album?.name || "Unknown album",
    artwork: track.album?.images?.[0]?.url || null,
    durationMs: track.duration_ms || 0,
    uri: track.uri,
  }));
}

export function extractTrackUris(tracks = []) {
  return tracks.map((track) => track.uri);
}
