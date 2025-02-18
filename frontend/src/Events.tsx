import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Comp {
  id: number;
  comp_name: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Comp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/comps");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div>
          {/* Display events as buttons */}
          <div className="event-buttons">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="event-button"
              >
                {event.comp_name}
              </Link>
            ))}
          </div>

          {/* Button to create a new event */}
          <Link to="/create-event" className="create-event-button">
            Create New Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default Events;
