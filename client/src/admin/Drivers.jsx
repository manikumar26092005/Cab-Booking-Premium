import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const availBadge = (a) => ({ Available: "badge badge-available", Busy: "badge badge-busy", Offline: "badge badge-offline" }[a] || "badge badge-offline");

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/drivers"), api.get("/cars")])
      .then(([dr, cr]) => { setDrivers(dr.data); setCars(cr.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssignCar = async (driverId, carId) => {
    if (!carId) return;
    try { await api.put(`/drivers/${driverId}/assign-car`, { carId }); fetchData(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/drivers/${deleteId}`); setDeleteId(null); fetchData(); }
    catch (err) { console.error(err); }
  };

  const filtered = drivers.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
    const matchAvail = !availFilter || d.availability === availFilter;
    return matchSearch && matchAvail;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">

        <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Drivers</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage driver accounts and vehicle assignments</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{filtered.length} driver{filtered.length !== 1 ? "s" : ""}</span>
            <button className="btn btn-ghost" onClick={fetchData} style={{ fontSize: "0.8rem" }}>↺ Refresh</button>
          </div>
        </div>

        {/* Delete modal */}
        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>⚠ Remove this driver?</h3>
              <p>This will permanently delete the driver account.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn-delete" style={{ padding: "9px 20px" }} onClick={handleDelete}>Yes, Remove</button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <span className="input-icon">🔍</span>
            <input
              placeholder="Search driver name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["", "Available", "Busy", "Offline"].map(a => (
              <button
                key={a}
                className={`sort-btn ${availFilter === a ? "active" : ""}`}
                onClick={() => setAvailFilter(a)}
                style={{ padding: "8px 14px", fontSize: "0.8rem" }}
              >
                {a || "All"}
              </button>
            ))}
          </div>
          {(search || availFilter) && (
            <button className="btn btn-ghost" onClick={() => { setSearch(""); setAvailFilter(""); }}>✕ Clear</button>
          )}
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius-lg)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧑‍💼</div>
            <p className="empty-state-title">No drivers found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {filtered.map((d, i) => (
              <div key={d._id} className="panel" style={{ padding: 0, overflow: "hidden", animationDelay: `${i * 40}ms` }}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  {/* Left: avatar + info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-full)",
                      background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "1rem", color: "#fff", flexShrink: 0,
                    }}>
                      {d.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 2 }}>{d.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{d.email} · {d.phone || "No phone"}</p>
                    </div>
                  </div>
                  {/* Right: availability + earnings */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span className={availBadge(d.availability)}>{d.availability || "Offline"}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Earnings</p>
                      <p style={{ fontWeight: 700, color: "var(--success)", fontSize: "0.95rem" }}>₹{d.totalEarnings}</p>
                    </div>
                  </div>
                </div>

                {/* Car assignment + actions */}
                <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1rem" }}>🚗</span>
                    {d.car ? (
                      <>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{d.car.carModel} ({d.car.carNo})</span>
                        <span className="assigned-badge">Assigned</span>
                      </>
                    ) : (
                      <select
                        defaultValue=""
                        onChange={e => handleAssignCar(d._id, e.target.value)}
                        style={{ fontSize: "0.82rem", padding: "6px 10px", minWidth: 180 }}
                      >
                        <option value="">Assign a vehicle…</option>
                        {cars.map(c => (
                          <option key={c._id} value={c._id}>{c.carModel} ({c.carNo})</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button className="btn-delete" onClick={() => setDeleteId(d._id)}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
