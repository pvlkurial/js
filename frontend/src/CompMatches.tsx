import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/Match.css";

interface Match {
  id: number;
  match_name: string;
  match_date: string;
  organizer: string;
  match_imageurl: string;
}

const Matches: React.FC = () => {
  const { comp_id } = useParams<{ comp_id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/comps/${comp_id}`);
        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [comp_id]);

  return (
    <div className="matches-container">
      <h1 className="matches-title">Matches</h1>

      {loading ? (
        <p className="loading-text">Loading matches...</p>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <a
              key={match.id}
              href={`/match/${match.id}`}
              className="match-box"
            >
              <img
                src={match.match_imageurl}
                alt={match.match_name}
                className="match-image"
              />
              <div className="match-details">
                <h2 className="match-name">{match.match_name}</h2>
                <p className="match-date">{match.match_date}</p>
                <p className="match-organizer">Organized by {match.organizer}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
