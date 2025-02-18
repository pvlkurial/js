import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Player {
  player_id: string;
  player_name: string;
}

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();

  // Fetch players when the component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch('http://localhost:5000/players');
      const data = await response.json();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  const handleButtonClick = (playerId: string) => {
    // Navigate to the player's details page
    navigate(`/player/${playerId}`);
  };

  return (
    <div>
      <h1>Players List</h1>
      <div>
        {players.map((player) => (
          <button key={player.player_id} onClick={() => handleButtonClick(player.player_id)}>
            {player.player_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;
