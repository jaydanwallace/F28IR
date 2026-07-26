import { useState } from 'react';
import axios from 'axios';
import { useCountry } from './country';

type Track = { name: string; preview_url: string | null; external_url: string };

export default function Search() {
  const detectedCountry = useCountry();
  const [artist, setArtist] = useState('');
  const [country, setCountry] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.get('http://localhost:3001/api/search', {
        params: { artist, country: (country || detectedCountry).trim().toUpperCase() },
      });
      setTracks(res.data.tracks || []);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Search failed'
        : 'Search failed';
      setError(message);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" />
      <input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder={`Country (default: ${detectedCountry})`}
      />
      <button onClick={search} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p role="alert">{error}</p>}

      {activePreviewUrl ? (
        <audio controls src={activePreviewUrl} />
      ) : tracks.length > 0 ? (
        <p>Choose a track below to play its preview.</p>
      ) : null}

      <ul>
        {tracks.map((t, i) => (
          <li key={i}>
            <div>{t.name}</div>
            <a href={t.external_url} target="_blank" rel="noopener noreferrer">
              <button type="button">Play on Spotify</button>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}