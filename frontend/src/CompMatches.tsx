import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles/Match.css";

interface Team {
  team_id: number;
  team_name: string;
  logo_url: string;
}

interface Track {
  track_id: number;
  track_name: string;
}

interface Match {
  match_id: number;
  teams: Team[];
  tracks: Track[];
}

const Matches: React.FC = () => {
  const { comp_id } = useParams<{ comp_id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/comps/${comp_id}/matches`);
        const data = await response.json();
        console.log("Fetched matches:", data); // Debugging log
        setMatches(data);
        setFilteredMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [comp_id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredMatches(
      matches.filter((match) =>
        match.teams?.some((team) => team.team_name.toLowerCase().includes(value)) ||
        match.tracks?.some((track) => track.track_name.toLowerCase().includes(value))
      )
    );
  };

  return (
    <div className="matches-container">
      <div className="events-grid centeringtext">
        <h1 className="events-title">Matches</h1>
        <Link to={`/event/${comp_id}/create-match`} className="event-box centeringtext"> 
          Create a new Match 
        </Link>
        <div className="search-box-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <div className="search-dropdown">
                {filteredMatches.length > 0 ? (
                  filteredMatches.slice(0, 5).map((match) => (
                    <Link key={match.match_id} to={`/match/${match.match_id}`} className="search-result">
                      {match.teams?.map((team) => team.team_name).join(" vs ") || "Unknown Teams"} - 
                      {match.tracks?.[0]?.track_name || "Unknown Track"}
                    </Link>
                  ))
                ) : (
                  <p className="search-no-results">No results found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading matches...</p>
      ) : (
        <div className="matches-grid">
          {filteredMatches.map((match) => (
            <Link key={match.match_id} to={`/match/${match.match_id}`} className="match-box">
              {match.teams && match.teams.length >= 2 ? (
                <>
                  <img src={match.teams[0].logo_url} alt={match.teams[0].team_name} className="match-team-image left-image" />
                  <div className="match-details">
                    <h2 className="match-name">{match.teams[0].team_name} vs {match.teams[1].team_name}</h2>
                    <p className="match-track">Track: {match.tracks?.[0]?.track_name || "Unknown"}</p>
                  </div>
                  <img src={match.teams[1].logo_url} alt={match.teams[1].team_name} className="match-team-image right-image" />
                </>
              ) : (
                <div className="match-error">
                  <p>Match data missing teams.</p>
                  <pre>{JSON.stringify(match, null, 2)}</pre> {/* Debugging display */}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
