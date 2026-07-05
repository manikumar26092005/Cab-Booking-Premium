import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../AuthContext";

const Uhome = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <UserNavbar />
      <div className="page page-wrapper">

        {/* Hero greeting */}
        <div style={{
          background: "linear-gradient(135deg, var(--bg-card), var(--bg-elevated))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 40px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          overflow: "hidden",
          position: "relative",
        }}>
          <div className="hero-blob" style={{ width: 200, height: 200, right: -40, top: -40, opacity: 0.07, background: "var(--accent)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 6, fontWeight: 500 }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>
              {user?.name ? user.name : "Welcome to UCab"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 380 }}>
              Ready for your next ride? Book a cab or track your current rides.
            </p>
          </div>
          <div style={{ fontSize: "4rem", opacity: 0.8, animation: "float 3s ease-in-out infinite" }}>🚕</div>
        </div>

        {/* Quick action cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            {
              to: "/cabs",
              icon: "🚖",
              title: "Browse Cabs",
              desc: "Find and book available cabs near you",
              color: "var(--accent-glow)",
              border: "var(--border-active)",
              cta: "Book Now →",
            },
            {
              to: "/my-bookings",
              icon: "📋",
              title: "My Rides",
              desc: "Track your current and past bookings",
              color: "rgba(59,130,246,0.08)",
              border: "rgba(59,130,246,0.2)",
              cta: "View Rides →",
            },
          ].map((card, i) => (
            <Link to={card.to} key={card.title} style={{ textDecoration: "none", animationDelay: `${i * 80}ms` }}>
              <div className="glass-card" style={{
                padding: "28px",
                background: card.color,
                borderColor: card.border,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                cursor: "pointer",
              }}>
                <div style={{ fontSize: "2.2rem" }}>{card.icon}</div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--accent-light)", fontWeight: 600, marginTop: "auto" }}>
                  {card.cta}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info panel */}
        <div className="panel" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: "1.5rem" }}>💡</div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--text-primary)" }}>Tip: </strong>
              You can reschedule or cancel a Pending booking any time from <Link to="/my-bookings" style={{ color: "var(--accent-light)" }}>My Rides</Link>.
              Once the driver starts your ride, you'll see live status updates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Uhome;
