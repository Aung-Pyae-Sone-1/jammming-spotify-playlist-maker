import test from 'node:test'
import assert from 'node:assert/strict'
import {
  extractTrackUris,
  formatSpotifyTracks,
} from '../src/util/spotifyData.js'

test('formatSpotifyTracks keeps the fields used by the interface', () => {
  const tracks = formatSpotifyTracks([
    {
      id: 'track-1',
      name: 'Example Song',
      artists: [{ name: 'First Artist' }, { name: 'Second Artist' }],
      album: { name: 'Example Album' },
      uri: 'spotify:track:track-1',
    },
  ])

  assert.deepEqual(tracks, [
    {
      id: 'track-1',
      name: 'Example Song',
      artist: 'First Artist, Second Artist',
      album: 'Example Album',
      uri: 'spotify:track:track-1',
    },
  ])
})

test('formatSpotifyTracks handles missing artist and album data', () => {
  const tracks = formatSpotifyTracks([
    {
      id: 'track-2',
      name: 'Incomplete Song',
      uri: 'spotify:track:track-2',
    },
  ])

  assert.equal(tracks[0].artist, 'Unknown artist')
  assert.equal(tracks[0].album, 'Unknown album')
})

test('extractTrackUris returns only Spotify URIs', () => {
  const uris = extractTrackUris([
    { id: 'one', uri: 'spotify:track:one' },
    { id: 'two', uri: 'spotify:track:two' },
  ])

  assert.deepEqual(uris, ['spotify:track:one', 'spotify:track:two'])
})
