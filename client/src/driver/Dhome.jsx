import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import api from "../api";

const statusBadge = (status) => {
  const map = {
    "Pending":"badge badge-pending","Driver Assigned":"badge badge-driver-assigned",
    "Accepted":"badge badge-accepted","On the Way":"badge badge-on-the-way",
    "Completed":"badge badge-completed","Cancelled":"badge badge-cancelled",
  };
  return map[status] || "badge";
};

const Dhome = () => {
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({ totalEarnings:0, todaysEarnings:0, completedRidesCount:0, availability:"Offline" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get("/drivers/rides"), api.get("/drivers/dashboard-stats")])
      .then(([ridesRes, statsRes]) => { setRides(ridesRes.data); setStats(statsRes.data); })
      .catch((err) => setError(err.response?.data?.message || "Could not load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const act = async (fn) => { try { await fn(); fetchAll(); } catch (err) { alert(err.response?.data?.message || "Action failed"); } };

  const availBadge = { Available: "badge-available", Busy: "badge-busy", Offline: "badge-offline" }[stats.availability] || "badge-offline";

  const statCards = [
    { icon: "💰", label: "Today's Earnings", value: `₹${stats.todaysEarnings}`, iconClass: "icon-amber" },
    { icon: "📈", label: "Total Earnings", value: `₹${stats.totalEarnings}`, iconClass: "icon-green" },
    { icon: "✅", label: "Completed Rides", value: stats.completedRidesCount, iconClass: "icon-blue" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <DriverNavbar />
      <div className="page page-wrapper">

        {/* Header with availability badge */}
        <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Driver Dashboard</h1>
            <p className="page-subtitle">Manage your assigned rides and earnings</p>
          </div>
          <span className={`badge ${availBadge}`} style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
            {stats.availability}
          </span>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        {/* Stat cards */}
        <div className="stats-row">
          {statCards.map((c, i) => (
            <div className="stat-card" key={c.label} style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`stat-icon ${c.iconClass}`}>{c.icon}</div>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Rides table */}
        <div className="section-header">
          <p className="section-title">Assigned Rides</p>
          <button className="btn btn-ghost" onClick={fetchAll} style={{ fontSize: "0.8rem" }}>↺ Refresh</button>
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius-lg)" }} />)}
          </div>
        ) : rides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <p className="empty-state-title">No rides assigned yet</p>
            <p>New ride requests will appear here. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {rides.map((r, i) => (
              <div key={r._id} className="panel" style={{ padding: 0, overflow: "hidden", animationDelay: `${i * 50}ms` }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: "1.4rem" }}>🗺</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{r.pickupCity} → {r.dropCity}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800, color: "var(--accent-light)", fontSize: "1.05rem" }}>₹{r.fare}</span>
                    <span className={statusBadge(r.status)}>{r.status}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                  {[
                    { label: "Rider", val: r.user?.name },
                    { label: "Car", val: `${r.car?.carModel} (${r.car?.carNo})` },
                    { label: "Pickup Time", val: r.pickupTime },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)" }}>{val}</p>
                    </div>
                  ))}
                </div>
                {/* Action buttons based on status */}
<div
  style={{
    padding: "12px 20px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  }}
>
  {(r.status === "Pending" || r.status === "Driver Assigned") && (
    <>
      <button
        className="btn-success"
        onClick={() =>
          act(() =>
            api.put(`/drivers/rides/${r._id}/respond`, {
              response: "Accepted",
            })
          )
        }
      >
        ✓ Accept Ride
      </button>

      <button
        className="btn-danger"
        onClick={() =>
          act(() =>
            api.put(`/drivers/rides/${r._id}/respond`, {
              response: "Rejected",
            })
          )
        }
      >
        ✕ Reject
      </button>
    </>
  )}

  {r.status === "Accepted" && (
    <button
      className="btn-warning"
      onClick={() =>
        act(() =>
          api.put(`/drivers/rides/${r._id}/status`, {
            status: "On the Way",
          })
        )
      }
    >
      ▶ Start Ride
    </button>
  )}

  {r.status === "On the Way" && (
    <button
      className="btn-success"
      onClick={() =>
        act(() =>
          api.put(`/drivers/rides/${r._id}/status`, {
            status: "Completed",
          })
        )
      }
    >
      🏁 Complete Ride
    </button>
  )}
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dhome;
