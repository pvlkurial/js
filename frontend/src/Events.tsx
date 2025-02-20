import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Events.css";

interface Comp {
  comp_id: number;
  comp_name: string;
  comp_imageurl: string;
  start_date: string;
  end_date: string;
  organizer: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Comp[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Comp[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/comps");
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredEvents(
      events.filter((e) => e.comp_name.toLowerCase().includes(value))
    );
  };

  return (
    <div className="events-container">
      <div className="events-grid centeringtext">
        <h1 className="events-title">Events</h1>
        <Link to="/create-event" className="event-box centeringtext"> Create a new Event
        </Link>
        <div className="search-box-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <div className="search-dropdown">
              {filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 5).map((event) => (
                  <Link key={event.comp_id} to={`/event/${event.comp_id}`} className="search-result">
                    {event.comp_name}
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
        <p className="loading-text">Loading events...</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <Link key={event.comp_id} to={`/event/${event.comp_id}`} className="event-box">
              <img src={event.comp_imageurl} alt={event.comp_name} className="event-image" />
              <div className="event-details">
                <h2 className="event-name">{event.comp_name}</h2>
                <p className="event-date">📅 {event.start_date} - {event.end_date}</p>
                <p className="event-organizer">👤 {event.organizer}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
