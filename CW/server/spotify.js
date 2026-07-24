const axios = require('axios');

let token = null;
let expiresAt = 0;

async function getToken() {
  if (token && Date.now() < expiresAt) return token;

  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64'),
      },
    }
  );

  token = res.data.access_token;
  expiresAt = Date.now() + res.data.expires_in * 1000 - 60000;
  return token;
}

module.exports = { getToken };