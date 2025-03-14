import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <title>Events | Match Dumper</title>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-stretch">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 content-evenly">
        <div className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5">
          <div className="">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            
          </div>
        </div>
          <div className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5 hover:bg-muted/100">
            <Link to="/create-event" className="event-box text-center"> Create a new Event
            </Link>
          </div>
        <div className="rounded-xl bg-muted/50 flex justify-center items-center h-full p-5">
          <h1 className="text-center">Date picker</h1>
        </div>

      </div>

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : (


        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
           <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3  ">


              {filteredEvents.map((event) => (
                <Link key={event.comp_id} to={`/event/${event.comp_id}`} className="relative aspect-video rounded-xl 
                flex justify-center items-center h-full overflow-hidden group z-99">
                  <img src={event.comp_imageurl} alt={event.comp_name} className=" z-0 object-fill w-full group-hover:blur-[3px] transition duration-200 ease-in" />
                  <div className="font-bold text-white text-center absolute opacity-75 z-40 left-0 right-0 px-4 py-2
                                  group-hover:opacity-100 transition duration-300 group-hover:drop-shadow-lg">
                    <h2 className="z-10 text-4xl ">{event.comp_name}</h2>
                    <p className="z-10 text-xl">date {event.start_date} - {event.end_date}</p>
                    <p className="z-10 text-xl">orga {event.organizer}</p>
                  </div>
                </Link>
              ))}

          </div>
        </div>
      )}
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
};

export default Events;
