import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./styles/CreateMatch.css";

interface Team {
    team_id: number;
    team_name: string;
    logo_url: string;
}

const CreateMatch: React.FC = () => {
    const { comp_id } = useParams<{ comp_id: string }>();
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam1, setSelectedTeam1] = useState<Team | null>(null);
    const [selectedTeam2, setSelectedTeam2] = useState<Team | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://localhost:5000/teams");
                const data = await response.json();
                setTeams(Array.isArray(data) ? data : data.teams || []);
            } catch (error) {
                setErrorMessage("Failed to fetch teams. Please try again.");
            }
        };
        fetchTeams();
    }, []);

    const handleCreateMatchAndUpload = async () => {
        setErrorMessage(null);
        if (!selectedTeam1 || !selectedTeam2 || selectedTeam1.team_id === selectedTeam2.team_id) {
            setErrorMessage("Please select two different teams.");
            return;
        }

        setLoading(true);

        try {
            const matchResponse = await fetch("http://localhost:5000/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teams: [selectedTeam1.team_id, selectedTeam2.team_id],
                    comp_id: Number(comp_id),
                })
            });

            const matchData = await matchResponse.json();

            if (!matchResponse.ok) {
                throw new Error(matchData.error || "Error creating match.");
            }

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("match_id", matchData.match_id.toString());

                const uploadResponse = await fetch("http://localhost:5000/upload-csv", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadData.error || "Error uploading CSV.");
                }
            }

            navigate(`/event/${comp_id}`, { state: { successMessage: "Match created successfully!" } });

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-match-container">
            <title>Create Match | Match Dumper</title>
            <h1>Create Match</h1>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="select-container">
                <Select
                    options={teams.map(team => ({ value: team.team_id, label: team.team_name }))}
                    onChange={(selected) => setSelectedTeam1(teams.find(team => team.team_id === selected?.value) || null)}
                    placeholder="Select Team 1"
                />
            </div>

            <div className="select-container">
                <Select
                    options={teams.filter(team => team.team_id !== selectedTeam1?.team_id).map(team => ({ value: team.team_id, label: team.team_name }))}
                    onChange={(selected) => setSelectedTeam2(teams.find(team => team.team_id === selected?.value) || null)}
                    placeholder="Select Team 2"
                />
            </div>

            <input type="file" accept=".csv" className="file-input" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <button className="button" onClick={handleCreateMatchAndUpload} disabled={loading}>
                {loading ? "Processing..." : "Create Match & Upload CSV"}
            </button>
        </div>
    );
};

export default CreateMatch;
