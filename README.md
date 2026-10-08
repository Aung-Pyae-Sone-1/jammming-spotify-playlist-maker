# Jammming — Playlist Maker

Jammming is a responsive React application that lets users search for music, create a custom playlist, and save it to their Spotify account.

This project was created as part of Codecademy’s curriculum to practice React state management, explore AI-assisted responsive interface design, deploy a static application with Netlify, and learn API integration using the Spotify Web API.

## Live Demo

[Open Playlist Maker](https://playlist-maker-spotify.netlify.app/)

## Features

- Secure Spotify login using PKCE authentication
- Search by song, artist, or album
- View album artwork and track information
- Add and remove tracks from a custom playlist
- Create a live cover collage from selected tracks
- Save the completed playlist to Spotify
- Responsive desktop and mobile interface

## Requirements and Setup

- Node.js 20.19 or newer, npm, a Spotify account, and a Spotify Developer application
- All project packages, including React, Vite, ESLint, and Prettier, are installed with `npm install`
- Create `.env.local` with `VITE_SPOTIFY_CLIENT_ID` and `VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/`

```bash
npm install
npm run dev -- --host 127.0.0.1
```
