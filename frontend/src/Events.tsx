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
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {loading ? (
        <p className="text-lg">Loading events...</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                {event.comp_name}
              </Link>
            ))}
          </div>

          <Link
            to="/create-event"
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Create New Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default Events;
