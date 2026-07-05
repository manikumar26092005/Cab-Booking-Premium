import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import api from "../api";

const DriverEarnings = () => {
  const [data, setData] = useState({ totalEarnings: 0, ridesCompleted: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/drivers/earnings").then((res) => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <DriverNavbar />
      <div className="page page-wrapper">

        <div className="page-header">
          <h1 className="page-title">My Earnings</h1>
          <p className="page-subtitle">Track your income and completed rides</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <div className="stats-row">
              {[
                { icon: "💰", label: "Total Earnings", value: `₹${data.totalEarnings}`, iconClass: "icon-amber" },
                { icon: "✅", label: "Rides Completed", value: data.ridesCompleted, iconClass: "icon-green" },
                { icon: "📊", label: "Avg per Ride", value: data.ridesCompleted ? `₹${Math.round(data.totalEarnings / data.ridesCompleted)}` : "₹0", iconClass: "icon-blue" },
              ].map((c, i) => (
                <div className="stat-card" key={c.label} style={{ animationDelay: `${i * 70}ms` }}>
                  <div className={`stat-icon ${c.iconClass}`}>{c.icon}</div>
                  <div className="stat-label">{c.label}</div>
                  <div className="stat-value">{c.value}</div>
                </div>
              ))}
            </div>

            {data.history.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <p className="empty-state-title">No completed rides yet</p>
                <p>Complete rides to see your earnings here.</p>
              </div>
            ) : (
              <div className="panel" style={{ padding: 0 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                  <p className="section-title">Ride History</p>
                </div>
                <div className="table-wrap" style={{ border: "none" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Rider</th>
                        <th>Car</th>
                        <th>Fare Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.history.map((h, i) => (
                        <tr key={h._id} style={{ animationDelay: `${i * 30}ms` }}>
                          <td>{new Date(h.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                          <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{h.user?.name}</td>
                          <td>{h.car?.carModel} <span style={{ color: "var(--text-muted)" }}>({h.car?.carNo})</span></td>
                          <td><span style={{ color: "var(--success)", fontWeight: 700, fontSize: "0.95rem" }}>₹{h.fare}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverEarnings;
