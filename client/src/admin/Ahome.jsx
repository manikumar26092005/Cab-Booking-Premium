import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Ahome = () => {
  const [stats, setStats] = useState({ users: 0, cabs: 0, bookings: 0, drivers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    { icon: "👥", label: "Total Users",    value: stats.users,    iconClass: "icon-blue",   link: "/admin/users" },
    { icon: "🚗", label: "Total Cars",     value: stats.cabs,     iconClass: "icon-amber",  link: "/admin/cabs" },
    { icon: "🧑‍💼", label: "Total Drivers", value: stats.drivers || 0, iconClass: "icon-purple", link: "/admin/drivers" },
    { icon: "📋", label: "Total Bookings", value: stats.bookings,  iconClass: "icon-green",  link: "/admin/bookings" },
  ];

  const quickLinks = [
    { icon: "➕", label: "Add New Car",     to: "/admin/add-cab",   color: "var(--accent-glow)", border: "var(--border-active)" },
    { icon: "👥", label: "Manage Users",    to: "/admin/users",     color: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
    { icon: "🚗", label: "View Drivers",    to: "/admin/drivers",   color: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
    { icon: "📊", label: "View Reports",    to: "/admin/reports",   color: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">

        {/* Greeting banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(245,158,11,0.1))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 36px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}>
          <div className="hero-blob" style={{ width: 180, height: 180, right: 0, top: -40, opacity: 0.1, background: "#7c3aed" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 4 }}>{greeting}, Admin 👋</p>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.4px" }}>Platform Overview</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>Real-time stats for your UCab platform</p>
          </div>
          <div style={{ fontSize: "3rem", opacity: 0.7, animation: "float 3s ease-in-out infinite" }}>🛠</div>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="stats-row">
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: "var(--radius-lg)" }} />)}
          </div>
        ) : (
          <div className="stats-row">
            {statCards.map((c, i) => (
              <a href={c.link} key={c.label} style={{ textDecoration: "none" }}>
                <div className="stat-card" style={{ animationDelay: `${i * 70}ms`, cursor: "pointer" }}>
                  <div className={`stat-icon ${c.iconClass}`}>{c.icon}</div>
                  <div className="stat-label">{c.label}</div>
                  <div className="stat-value">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="section-header" style={{ marginTop: 8 }}>
          <p className="section-title">Quick Actions</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 32 }}>
          {quickLinks.map((q, i) => (
            <a href={q.to} key={q.label} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{
                padding: "20px 22px",
                background: q.color,
                borderColor: q.border,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                animationDelay: `${i * 60}ms`,
              }}>
                <div style={{ fontSize: "1.4rem" }}>{q.icon}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{q.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Click to view →</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Simple visual bar chart (no external lib needed) */}
        {!loading && (
          <div className="chart-section">
            <p className="chart-title">Platform at a Glance</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 120, justifyContent: "center" }}>
              {[
                { label: "Users", val: stats.users, color: "var(--info)" },
                { label: "Drivers", val: stats.drivers || 0, color: "#a78bfa" },
                { label: "Cars", val: stats.cabs, color: "var(--accent-light)" },
                { label: "Bookings", val: stats.bookings, color: "var(--success)" },
              ].map(({ label, val, color }) => {
                const max = Math.max(stats.users, stats.drivers || 0, stats.cabs, stats.bookings, 1);
                const h = Math.max(8, (val / max) * 90);
                return (
                  <div key={label} style={{ textAlign: "center", flex: 1 }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color, marginBottom: 6 }}>{val}</p>
                    <div style={{
                      height: h,
                      background: `linear-gradient(to top, ${color}33, ${color})`,
                      borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                      border: `1px solid ${color}44`,
                      transition: "height 0.6s var(--ease-spring)",
                    }} />
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6, textTransform: "capitalize" }}>{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ahome;
