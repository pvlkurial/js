import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface RecordData {
  track: string;
  player_id: string;
  player_name: string;
  cp: number;
  record: number;
}

const PlayerDetailsPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [data, setData] = useState<RecordData[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch player-specific data when the page loads
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5000/stats/${playerId}`);
      const result = await response.json();

      if (Array.isArray(result)) {
        // Extract unique tracks, making sure 'track' exists in each record
        const uniqueTracks = Array.from(new Set(result.map((item: RecordData) => item.track)));
        setTracks(uniqueTracks);
        setData(result);
      } else {
        console.error("Received data is not an array:", result);
      }
    };

    fetchData();
  }, [playerId]);

  const handleTrackClick = (track: string) => {
    // Navigate to the track details page
    navigate(`/player/${playerId}/track/${track}`);
  };

  return (
    <div>
      <h1>Player Details</h1>
      <div>
        <h2>Select a Track</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <button
                key={track}
                onClick={() => handleTrackClick(track)}
                style={{
                  padding: '20px 40px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {track}
              </button>
            ))
          ) : (
            <p>No tracks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
