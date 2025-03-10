import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ContentLoader from "react-content-loader"
import "react-tabs/style/react-tabs.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our data
interface Track {
  track_name: string;
  track_imageurl: string;
}

interface PlayerStat {
  ID: number;
  timestamp: number;
  track: string;
  player_id: string;
  player_name: string;
  record: number;
  round_number: string;
  points: number;
  cp: number;
  match_id: number;
}

interface PlayerDetails {
  isExpanded: boolean;
  bestTime: number;
  worstTime: number;
  medianTime: number;
  times: number[];
}

// Define the result type for fetch operations
interface FetchResult {
  trackName: string;
  data?: PlayerStat[];
  error?: string;
}

const playerColors = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#C9CBCF", // Gray
  "#00CC99", // Green
];

const MatchDetails: React.FC = () => {
  const { match_id } = useParams<{ match_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState<Record<string, PlayerStat[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerDetails, setPlayerDetails] = useState<Record<string, PlayerDetails>>({});
  const [disabledRounds, setDisabledRounds] = useState<Set<string>>(new Set());
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  // Store the tab index separately to prevent re-renders when clicking the same tab
  const [tabIndex, setTabIndex] = useState(0);

  // Reset state when location/match_id changes
  useEffect(() => {
    setTracks([]);
    setStats({});
    setLoading(true);
    setError(null);
    setPlayerDetails({});
    setDisabledRounds(new Set());
    setSelectedTrack(null);
    setTabIndex(0);
  }, [location.pathname, match_id]);

  // Custom style to fix the tab line issue
  const customTabStyles = `
    .react-tabs__tab--selected {
      border-bottom: none;
    }
    .react-tabs__tab-list {
      border-bottom: 1px solid #aaa;
      margin: 0 0 10px;
      padding: 0;
    }
  `;

  const fetchTracks = useCallback(async () => {
    if (!match_id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/matches/${match_id}/tracks`);
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      setTracks(data);
      // Set the first track as selected by default
      if (data.length > 0) {
        setSelectedTrack(data[0].track_name);
      }
    } catch (err) {
      setError("Error fetching tracks");
    }
  }, [match_id]);

  const fetchStats = useCallback(async () => {
    if (tracks.length === 0 || !match_id) return;
    
    try {
      setLoading(true);
      const statsData: Record<string, PlayerStat[]> = {};

      const fetchPromises = tracks.map((track) =>
        fetch(`http://localhost:5000/matches/${match_id}/track/${track.track_name}`)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to fetch stats for ${track.track_name}`);
            return response.json();
          })
          .then((data: PlayerStat[]) => {
            return { 
              trackName: track.track_name, 
              data: data 
            } as FetchResult;
          })
          .catch((err) => {
            console.error(`Error fetching ${track.track_name}:`, err);
            return { 
              trackName: track.track_name, 
              error: err.message 
            } as FetchResult;
          })
      );

      const results = await Promise.all(fetchPromises);

      results.forEach((result: FetchResult) => {
        if (!result.error && result.data) {
          statsData[result.trackName] = result.data;
        }
      });

      setStats(statsData);
    } catch (err) {
      console.error("Error in fetchStats:", err);
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  }, [tracks, match_id]);

  // Initial fetch for tracks
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Fetch stats when tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      fetchStats();
    }
  }, [tracks, fetchStats]);

  // This effect updates player details whenever the relevant state changes
  const updatePlayerDetails = useCallback(() => {
    if (!selectedTrack || !stats[selectedTrack]) return;
    
    const details: Record<string, PlayerDetails> = {};
    const trackStats = stats[selectedTrack];
    const playerRecords: Record<string, number[]> = {};

    // Create a copy of the previous state to preserve expansion state
    const prevDetails = { ...playerDetails };

    // Filter stats based on selected track and enabled rounds only
    trackStats.forEach((stat) => {
      if (!disabledRounds.has(stat.round_number)) {
        if (!playerRecords[stat.player_name]) {
          playerRecords[stat.player_name] = [];
        }
        playerRecords[stat.player_name].push(stat.record);
      }
    });

    // Calculate stats for each player
    Object.entries(playerRecords).forEach(([player, records]) => {
      if (records.length > 0) {
        const sortedRecords = [...records].sort((a, b) => a - b);
        const bestTime = sortedRecords[0];
        const worstTime = sortedRecords[sortedRecords.length - 1];

        let medianTime: number;
        const mid = Math.floor(sortedRecords.length / 2);
        if (sortedRecords.length % 2 === 0) {
          medianTime = (sortedRecords[mid - 1] + sortedRecords[mid]) / 2;
        } else {
          medianTime = sortedRecords[mid];
        }

        details[player] = {
          // Preserve expanded state from previous details or default to false
          isExpanded: prevDetails[player]?.isExpanded || false,
          bestTime,
          worstTime,
          medianTime,
          times: sortedRecords,
        };
      }
    });

    setPlayerDetails(details);
  }, [selectedTrack, stats, disabledRounds, playerDetails]);

  // Update player details when necessary dependencies change
  useEffect(() => {
    if (selectedTrack && stats[selectedTrack]) {
      updatePlayerDetails();
    }
  }, [selectedTrack, disabledRounds, stats, updatePlayerDetails]);

  const togglePlayerExpand = (playerName: string, event: React.MouseEvent) => {
    // Stop propagation to prevent the event from affecting other components
    event.stopPropagation();
    
    setPlayerDetails((prev) => ({
      ...prev,
      [playerName]: {
        ...prev[playerName],
        isExpanded: !prev[playerName].isExpanded,
      },
    }));
  };

  const formatTime = (timeMs: number) => {
    if (!timeMs && timeMs !== 0) return "00:00:000";
    
    const totalSeconds = timeMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const ms = Math.floor((totalSeconds % 1) * 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
  };

  const getPlayerColor = (playerName: string) => {
    const players = Object.keys(playerDetails);
    const playerIndex = players.indexOf(playerName);
    return playerColors[playerIndex % playerColors.length];
  };

  const generateChartData = (trackName: string) => {
    if (!stats[trackName]) return null;

    // Get all round numbers and sort them
    const roundNumbers = [...new Set(stats[trackName].map((stat) => stat.round_number))].sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Filter out disabled rounds
    const filteredRoundNumbers = roundNumbers.filter((round) => !disabledRounds.has(round));

    // Group data by player
    const playerData: Record<string, Record<string, number>> = {};
    stats[trackName].forEach(({ player_name, record, round_number }) => {
      if (!disabledRounds.has(round_number)) {
        if (!playerData[player_name]) {
          playerData[player_name] = {};
        }
        playerData[player_name][round_number] = record / 1000;
      }
    });

    // Assign colors to players
    const players = Object.keys(playerData);
    const playerColorMap: Record<string, string> = {};
    players.forEach((player, index) => {
      playerColorMap[player] = playerColors[index % playerColors.length];
    });

    return {
      labels: filteredRoundNumbers,
      datasets: players.map((player) => ({
        label: player,
        data: filteredRoundNumbers.map((round) => playerData[player][round] || null),
        borderColor: playerColorMap[player],
        backgroundColor: `${playerColorMap[player]}40`, // Add opacity to the background color
        fill: false,
        tension: 0.1,
      })),
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
        ticks: {
          callback: function (value: number) {
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Round Number",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            if (value === null || value === undefined) return context.dataset.label + ": No data";
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            const ms = Math.floor((value % 1) * 1000);
            return `${context.dataset.label}: ${minutes}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
          },
        },
      },
    },
  };

  const handleTabSelect = (index: number) => {
    // Only update the selectedTrack if the tab actually changes
    if (index !== tabIndex) {
      const newSelectedTrack = tracks[index]?.track_name || null;
      setSelectedTrack(newSelectedTrack);
      setTabIndex(index);
    }
  };
  
  const handleRoundToggle = (round: string) => {
    const newDisabledRounds = new Set(disabledRounds);
    if (newDisabledRounds.has(round)) {
      newDisabledRounds.delete(round);
    } else {
      newDisabledRounds.add(round);
    }
    setDisabledRounds(newDisabledRounds);
  };

  if (loading) {
    return (
      <div className="mx-auto p-4">
        <h1>Loading Match Details...</h1>
        <ContentLoader 
          speed={2}
          width={400}
          height={300}
          viewBox="0 0 400 300"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="10" rx="3" ry="3" width="250" height="20" />
          <rect x="0" y="40" rx="3" ry="3" width="400" height="200" />
          <rect x="0" y="250" rx="3" ry="3" width="400" height="50" />
        </ContentLoader>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mx-auto p-4 text-red-500">
        <h1>Error Loading Match Details</h1>
        <p>{error}</p>
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchTracks();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="mx-auto p-4">
        <h1>Match {match_id} Details</h1>
        <p>No tracks found for this match.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Add custom styles to fix tab line issue */}
      <style>{customTabStyles}</style>
      <h1 className="">Match {match_id} Details</h1>
      <Tabs onSelect={handleTabSelect} selectedIndex={tabIndex}>
        <TabList>
          {tracks.map((track) => (
            <Tab key={track.track_name}>{track.track_name}</Tab>
          ))}
        </TabList>

        {tracks.map((track) => (
          <TabPanel key={track.track_name}>
            <h2 className="">{track.track_name}</h2>

            {/* Round Filters */}
            <div className="round-filters flex-container-buttons">
              {stats[track.track_name] && Array.from(new Set(stats[track.track_name].map((stat) => stat.round_number)))
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((round) => (
                  <div
                    key={round}
                    className={`round-filter-box ${disabledRounds.has(round) ? "disabled button-graph-disabled" : "button-graph"}`}
                    onClick={() => handleRoundToggle(round)}
                  >
                    R{round}
                  </div>
                ))}
            </div>

            {/* Only show the currently selected track's data */}
            {selectedTrack === track.track_name && stats[track.track_name] ? (
              <div className="flex-container">
                {/* Chart container */}
                <div className="chart-container">
                  {generateChartData(track.track_name) && (
                    <Line data={generateChartData(track.track_name)!} options={chartOptions} />
                  )}
                </div>

                {/* Player stats container - only show players from the current track */}
                <div className="player-stats-container">
                  {Object.keys(playerDetails)
                    .filter((player) => 
                      stats[track.track_name]?.some(
                        (stat) => stat.player_name === player && !disabledRounds.has(stat.round_number)
                      )
                    )
                    .map((player) => {
                      const playerColor = getPlayerColor(player);
                      const isExpanded = playerDetails[player]?.isExpanded;

                      return (
                        <Accordion
                          key={player}
                          sx={{
                            backgroundColor: "#242424",
                            "&:hover": { backgroundColor: "#333" },
                          }}
                          expanded={isExpanded}
                          onChange={(_, expanded) => {
                            setPlayerDetails((prev) => ({
                              ...prev,
                              [player]: {
                                ...prev[player],
                                isExpanded: expanded,
                              },
                            }));
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                            sx={{
                              borderLeft: `10px solid ${playerColor}`,
                              "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: "medium",
                                color: playerColor,
                              }}
                            >
                              {player}
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "#ffffff" }}>
                                      Stat
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#ffffff" }}>
                                      Time
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={{ color: "#ffffff" }}>Best Time</TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", color: "#ffffff" }}>
                                      {formatTime(playerDetails[player]?.bestTime)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={{ color: "#ffffff" }}>Median Time</TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", color: "#ffffff" }}>
                                      {formatTime(playerDetails[player]?.medianTime)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={{ color: "#ffffff" }}>Worst Time</TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", color: "#ffffff" }}>
                                      {formatTime(playerDetails[player]?.worstTime)}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div>
                <p>No data available for this track.</p>
              </div>
            )}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default MatchDetails;