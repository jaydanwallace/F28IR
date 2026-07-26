require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const { getToken } = require('./spotify');
const { sequelize, Search } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Requirements 1 to 5
app.get('/api/search', async (req, res) => {
  try {
    const artist = (req.query.artist || '').trim();
    const country = (req.query.country || '').trim().toUpperCase() || 'US';

    if (!artist) return res.status(400).json({ error: 'artist is required' });

    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // find the artist
    const searchRes = await axios.get('https://api.spotify.com/v1/search', {
      headers,
      params: { q: artist, type: 'artist', limit: 1 },
    });
    const found = searchRes.data.artists.items[0];
    if (!found) return res.status(404).json({ error: 'artist not found' });

    let tracks = [];

    try {
      // get their top tracks in that market
      const topRes = await axios.get(`https://api.spotify.com/v1/artists/${found.id}/top-tracks`, {
        headers,
        params: { market: country },
      });
      tracks = (topRes.data.tracks || []).slice(0, 10);
    } catch (topErr) {
      if (topErr.response?.status === 403) {
        const fallbackRes = await axios.get('https://api.spotify.com/v1/search', {
          headers,
          params: { q: artist, type: 'track', market: country, limit: 10 },
        });
        tracks = (fallbackRes.data.tracks?.items || []).slice(0, 10);
      } else {
        throw topErr;
      }
    }

    if (!tracks.length) {
      return res.status(404).json({ error: 'no tracks found' });
    }

    // Requirement 6
    await Search.create({ artist: found.name, country, trackCount: tracks.length });

    res.json({
      artist: found.name,
      country,
      tracks: tracks.map((t) => ({
        name: t.name,
        preview_url: t.preview_url,
        external_url: t.external_urls?.spotify,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'search failed' });
  }
});

// Requirement 7
app.get('/api/searches/latest', async (req, res) => {
  const searches = await Search.findAll({ order: [['createdAt', 'DESC']], limit: 20 });
  res.json(
    searches.map((s) => ({ name: s.artist, country: s.country, tracks: s.trackCount }))
  );
});

// Requirement 8 and 9
io.on('connection', async (socket) => {
  const recent = await Search.findOne({ order: sequelize.random() });
  socket.emit('chat-topic', recent ? recent.artist : 'Music');

  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  });
});

sequelize.sync().then(() => {
  const port = process.env.PORT || 3001;
  server.listen(port, () => console.log(`Server running on port ${port}`));
});