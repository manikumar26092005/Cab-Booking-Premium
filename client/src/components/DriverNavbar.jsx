import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const DriverNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const initial = user?.name ? user.name[0].toUpperCase() : "D";

  const handleLogout = () => { logout(); navigate("/driver/login"); };

  return (
    <nav className="navbar">
      <Link to="/driver/home" className="brand">🚗 UCab Driver</Link>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/driver/home" className={isActive("/driver/home") ? "active" : ""}>My Rides</Link>
        <Link to="/driver/earnings" className={isActive("/driver/earnings") ? "active" : ""}>Earnings</Link>
        <div className="nav-user-chip">
          <div className="nav-user-avatar" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{initial}</div>
          <span>{user?.name?.split(" ")[0] || "Driver"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>↩ Logout</button>
      </div>
    </nav>
  );
};

export default DriverNavbar;
