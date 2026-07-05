import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const navItems = [
    { to: "/admin/home", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/drivers", label: "Drivers" },
    { to: "/admin/cabs", label: "Cars" },
    { to: "/admin/add-cab", label: "+ Add Car" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/reports", label: "Reports" },
  ];

  return (
    <nav className="navbar">
      <Link to="/admin/home" className="brand">🛠 UCab Admin</Link>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={isActive(item.to) ? "active" : ""}>{item.label}</Link>
        ))}
        <button className="logout-btn" onClick={handleLogout}>↩ Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
