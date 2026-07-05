import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate("/login"); };

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <nav className="navbar">
      <Link to="/home" className="brand">🚕 UCab</Link>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/home" className={isActive("/home") ? "active" : ""}>Home</Link>
        <Link to="/cabs" className={isActive("/cabs") ? "active" : ""}>Browse Cabs</Link>
        <Link to="/my-bookings" className={isActive("/my-bookings") ? "active" : ""}>My Rides</Link>
        <div className="nav-user-chip">
          <div className="nav-user-avatar">{initial}</div>
          <span>{user?.name?.split(" ")[0] || "User"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>↩ Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
