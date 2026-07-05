import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ── Premium Landing Page ────────────────────────────────── */
const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand">🚕 UCab</Link>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/login">User Login</Link>
          <Link to="/driver/login">Driver Login</Link>
          <Link to="/admin/login">Admin Login</Link>
          <Link to="/register">
            <button className="btn btn-accent" style={{ padding: "7px 16px" }}>Get Started →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div className="hero-badge">
            ✦ Fast, Reliable &amp; Affordable Rides
          </div>

          <h1 className="hero-title">
            Your Ride,{" "}
            <span className="gradient-text">Your Way</span>
          </h1>

          <p className="hero-sub">
            Book a cab in seconds. Track your ride in real time.
            Professional drivers, transparent pricing — no surprises.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-cta hero-cta-primary">
              🚗 Book a Ride Now
            </Link>
            <Link to="/driver/register" className="hero-cta hero-cta-secondary">
              Become a Driver →
            </Link>
          </div>

          <span className="hero-car">🚕</span>

          <div className="hero-features">
            {[
              { icon: "⚡", text: "Instant Booking" },
              { icon: "🔒", text: "Safe & Secure" },
              { icon: "📍", text: "Real-Time Tracking" },
              { icon: "💳", text: "Easy Payments" },
            ].map((f) => (
              <div className="hero-feature" key={f.text}>
                <span className="hero-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role cards section */}
      <section style={{ padding: "60px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="gradient-line" />
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
          Choose your role
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { emoji: "👤", title: "I'm a Rider", desc: "Book cabs, track rides, download receipts.", to: "/register", cta: "Register as User", color: "var(--accent-glow)", border: "var(--border-active)" },
            { emoji: "🚗", title: "I'm a Driver", desc: "Accept rides, earn money, manage your schedule.", to: "/driver/register", cta: "Register as Driver", color: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)" },
            { emoji: "🛠", title: "I'm an Admin", desc: "Manage users, drivers, bookings, and analytics.", to: "/admin/login", cta: "Admin Login", color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)" },
          ].map((card, i) => (
            <div key={card.title} className="glass-card" style={{ padding: 28, background: card.color, borderColor: card.border, animationDelay: `${i * 80}ms` }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{card.emoji}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.6 }}>{card.desc}</p>
              <Link to={card.to}>
                <button className="btn btn-ghost" style={{ width: "100%" }}>{card.cta} →</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
