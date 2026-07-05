import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Reports = () => {
  const [data, setData] = useState({ statusBreakdown: [], totalRevenue: 0, topCars: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reports").then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusColors = {
    Pending: "var(--warning)", "Driver Assigned": "#a78bfa", Accepted: "var(--info)",
    "On the Way": "#fb923c", Completed: "var(--success)", Cancelled: "var(--danger)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Platform performance at a glance</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {/* Revenue stat */}
            <div className="stats-row" style={{ marginBottom: 24 }}>
              <div className="stat-card">
                <div className="stat-icon icon-green">💰</div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">₹{data.totalRevenue}</div>
                <div className="stat-sub">From completed rides</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon icon-blue">🔢</div>
                <div className="stat-label">Total Statuses Tracked</div>
                <div className="stat-value">{data.statusBreakdown.reduce((s, x) => s + x.count, 0)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon icon-amber">⭐</div>
                <div className="stat-label">Top Performing Car</div>
                <div className="stat-value" style={{ fontSize: "1.1rem" }}>{data.topCars[0]?.carModel || "—"}</div>
                <div className="stat-sub">{data.topCars[0] ? `${data.topCars[0].rides} rides` : ""}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
              {/* Status breakdown */}
              <div className="chart-section">
                <p className="chart-title">Booking Status Breakdown</p>
                {data.statusBreakdown.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No booking data yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {data.statusBreakdown.map(({ _id, count }) => {
                      const total = data.statusBreakdown.reduce((s, x) => s + x.count, 0);
                      const pct = total ? Math.round((count / total) * 100) : 0;
                      const color = statusColors[_id] || "var(--text-muted)";
                      return (
                        <div key={_id}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{_id || "Unknown"}</span>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "var(--radius-full)", transition: "width 0.6s var(--ease)" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top cars */}
              <div className="chart-section">
                <p className="chart-title">Top Performing Cars</p>
                {data.topCars.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No booking data yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.topCars.map(({ carModel, carNo, rides }, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "var(--radius-sm)",
                          background: i === 0 ? "var(--warning-bg)" : "var(--bg-elevated)",
                          color: i === 0 ? "var(--warning)" : "var(--text-muted)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: "0.8rem",
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: 2 }}>{carModel}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{carNo}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: "var(--accent-light)", fontSize: "0.875rem" }}>{rides} rides</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
