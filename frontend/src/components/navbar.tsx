import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/events" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
          Events
        </NavLink>
        <NavLink to="/players" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
          Players
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
          Upload
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
