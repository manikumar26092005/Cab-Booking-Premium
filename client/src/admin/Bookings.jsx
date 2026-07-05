import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const statusBadge = (status) => {
  const map = {
    "Pending":"badge badge-pending","Driver Assigned":"badge badge-driver-assigned",
    "Accepted":"badge badge-accepted","On the Way":"badge badge-on-the-way",
    "Completed":"badge badge-completed","Cancelled":"badge badge-cancelled",
  };
  return map[status] || "badge";
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelId, setCancelId] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/bookings"), api.get("/drivers")])
      .then(([b, d]) => { setBookings(b.data); setDrivers(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssignDriver = async (bookingId, driverId) => {
    if (!driverId) return;
    try {
      await api.put(`/bookings/${bookingId}/assign-driver`, { driverId });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Could not assign driver"); fetchData(); }
  };

  const handleCancel = async () => {
    try { await api.delete(`/bookings/${cancelId}`); setCancelId(null); fetchData(); }
    catch (err) { console.error(err); }
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b._id.toLowerCase().includes(q) ||
      b.user?.name?.toLowerCase().includes(q) ||
      b.driver?.name?.toLowerCase().includes(q) ||
      b.car?.carModel?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["Pending","Driver Assigned","Accepted","On the Way","Completed","Cancelled"];
  const availDrivers = drivers.filter(d => d.availability === "Available");
  const unavailDrivers = drivers.filter(d => d.availability !== "Available");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">

        {/* Header */}
        <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Bookings</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Admins assign drivers only — ride status is managed by drivers.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <button className="btn btn-ghost" onClick={fetchData} style={{ fontSize: "0.8rem" }}>↺ Refresh</button>
          </div>
        </div>

        {/* Cancel modal */}
        {cancelId && (
          <div className="modal-overlay" onClick={() => setCancelId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>⚠ Cancel this booking?</h3>
              <p>The driver (if assigned) will be freed automatically.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setCancelId(null)}>Keep It</button>
                <button className="btn-delete" style={{ padding: "9px 20px" }} onClick={handleCancel}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter toolbar */}
        <div className="toolbar">
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <span className="input-icon">🔍</span>
            <input
              placeholder="Search by ID, user, driver or car..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: "100%" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(search || statusFilter) && (
            <button className="btn btn-ghost" onClick={() => { setSearch(""); setStatusFilter(""); }}>
              ✕ Clear
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: "var(--radius-lg)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-title">No bookings found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {filtered.map((b, i) => {
              const canAssign = ["Pending","Driver Assigned"].includes(b.status);
              return (
                <div key={b._id} className="panel" style={{ padding: 0, overflow: "hidden", animationDelay: `${i * 40}ms` }}>
                  {/* Card header row */}
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: "1.3rem" }}>🗺</div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                          {b.pickupCity} → {b.dropCity}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                          {b._id.slice(-10).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "var(--accent-light)" }}>₹{b.fare}</span>
                      <span className={statusBadge(b.status)}>{b.status}</span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div style={{ padding: "12px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px 20px" }}>
                    {[
                      { label: "User",   val: b.user?.name || "-" },
                      { label: "Car",    val: b.car?.carModel ? `${b.car.carModel} (${b.car.carNo})` : "-" },
                      { label: "Pickup", val: `${b.pickupTime || ""}, ${new Date(b.pickupDate).toLocaleDateString()}` },
                      { label: "Date",   val: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions row */}
                  <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {/* Driver assignment */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      {b.driver?.name ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>👤 {b.driver.name}</span>
                          <span className="assigned-badge">Assigned</span>
                          {canAssign && (
                            <select
                              defaultValue=""
                              onChange={e => handleAssignDriver(b._id, e.target.value)}
                              style={{ fontSize: "0.78rem", padding: "4px 8px", minWidth: 120 }}
                            >
                              <option value="">Reassign…</option>
                              {availDrivers.map(d => <option key={d._id} value={d._id}>{d.name} — Available</option>)}
                              {unavailDrivers.map(d => <option key={d._id} value={d._id} disabled>{d.name} — {d.availability}</option>)}
                            </select>
                          )}
                        </div>
                      ) : canAssign ? (
                        <select
                          defaultValue=""
                          onChange={e => handleAssignDriver(b._id, e.target.value)}
                          style={{ fontSize: "0.82rem", padding: "7px 10px", minWidth: 180 }}
                        >
                          <option value="">Assign driver…</option>
                          {availDrivers.map(d => <option key={d._id} value={d._id}>{d.name} — Available</option>)}
                          {unavailDrivers.map(d => <option key={d._id} value={d._id} disabled>{d.name} — {d.availability}</option>)}
                        </select>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No driver assigned</span>
                      )}
                    </div>

                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button className="btn-delete" onClick={() => setCancelId(b._id)}>✕ Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
