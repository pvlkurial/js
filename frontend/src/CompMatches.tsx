import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search } from "lucide-react";
import { SearchForm } from "./components/search-form";

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
        <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="events">
                            Events
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
          <title>Matches | Match Dumper</title>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-stretch">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 content-evenly">
        <h1 className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5">Matches</h1>
        <Link to={`/event/${comp_id}/create-match`} className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5 hover:bg-muted/100"> 
          Create a new Match 
        </Link>
        <div className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
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
        </SidebarInset>
        </SidebarProvider>
  );
};

export default Matches;
