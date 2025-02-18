import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css"; // Import the CSS file

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">MatchDumper</div>
      <div className="navbar-links">
        <Link to="/events" className="nav-button">Events</Link>
        <Link to="/players" className="nav-button">Players</Link>
        <Link to="/upload" className="nav-button">Upload</Link>
      </div>
    </nav>
  );
};

export default Navbar;
