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

// --- FR1-5: search artist top tracks in a country ---
app.get('/api/search', async (req, res) => {
  try {
    const artist = (req.query.artist || '').trim();
    const country = (req.query.country || '').trim().toUpperCase();

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

    // get their top tracks in that market
    const topRes = await axios.get(
      `https://api.spotify.com/v1/artists/${found.id}/top-tracks`,
      { headers, params: { market: country } }
    );
    const tracks = topRes.data.tracks.slice(0, 10);

    // FR6: store the search (count only, per coursework Q&A)
    await Search.create({ artist: found.name, country, trackCount: tracks.length });

    res.json({
      artist: found.name,
      country,
      tracks: tracks.map((t) => ({
        name: t.name,
        preview_url: t.preview_url,
        external_url: t.external_urls.spotify,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'search failed' });
  }
});

// --- FR7: web service for the last 20 searches ---
app.get('/api/searches/latest', async (req, res) => {
  const searches = await Search.findAll({ order: [['createdAt', 'DESC']], limit: 20 });
  res.json(
    searches.map((s) => ({ name: s.artist, country: s.country, tracks: s.trackCount }))
  );
});

// --- FR8-9: chat, topic = a random past search ---
io.on('connection', async (socket) => {
  const recent = await Search.findOne({ order: sequelize.random() });
  socket.emit('chat-topic', recent ? recent.artist : 'Music');

  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  });
});

sequelize.sync().then(() => {
  server.listen(process.env.PORT, () => console.log('Server running'));
});