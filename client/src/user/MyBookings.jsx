import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import api from "../api";

const statusBadge = (status) => {
  const map = {
    "Pending":         "badge badge-pending",
    "Driver Assigned": "badge badge-driver-assigned",
    "Accepted":        "badge badge-accepted",
    "On the Way":      "badge badge-on-the-way",
    "Completed":       "badge badge-completed",
    "Cancelled":       "badge badge-cancelled",
  };
  return map[status] || "badge";
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [cancelId, setCancelId] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    api.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async () => {
    try {
      await api.delete(`/bookings/${cancelId}`);
      setCancelId(null);
      fetchBookings();
    } catch (err) { console.error(err); }
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${rescheduleId}/reschedule`, { pickupDate: newDate, pickupTime: newTime });
      setRescheduleId(null);
      fetchBookings();
    } catch (err) { alert(err.response?.data?.message || "Reschedule failed"); }
  };

  const downloadReceipt = async (id) => {
    try {
      const res = await api.get(`/bookings/${id}/receipt`);
      const r = res.data;
      const text = `UCab — Ride Receipt\n${"─".repeat(36)}\nReceipt ID : ${r.receiptId}\nDate       : ${new Date(r.issuedAt).toLocaleString()}\nRider      : ${r.rider}\nDriver     : ${r.driver}\nCar        : ${r.car}\nTrip       : ${r.trip}\nPickup     : ${r.pickup}\nFare       : ₹${r.fare}\nStatus     : ${r.status}\n${"─".repeat(36)}\nThank you for riding with UCab!`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${r.receiptId}.txt`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert(err.response?.data?.message || "Could not generate receipt"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <UserNavbar />
      <div className="page page-wrapper">

        <div className="page-header">
          <h1 className="page-title">My Rides</h1>
          <p className="page-subtitle">Track your current and past bookings</p>
        </div>

        {/* Reschedule modal */}
        {rescheduleId && (
          <div className="modal-overlay" onClick={() => setRescheduleId(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>📅 Reschedule Ride</h3>
              <p>Choose a new pickup date and time for your ride.</p>
              <form onSubmit={submitReschedule}>
                <div className="form-group">
                  <label>New Pickup Date</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>New Pickup Time</label>
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setRescheduleId(null)}>Cancel</button>
                  <button type="submit" className="btn btn-accent" style={{ padding: "9px 20px" }}>Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cancel confirmation modal */}
        {cancelId && (
          <div className="modal-overlay" onClick={() => setCancelId(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>⚠ Cancel Booking?</h3>
              <p>This action cannot be undone. Your booking will be cancelled immediately.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setCancelId(null)}>Keep Ride</button>
                <button className="btn-delete" style={{ padding: "9px 20px" }} onClick={handleCancel}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="panel" style={{ height: 80 }}>
                <div className="skeleton" style={{ height: "100%", borderRadius: "var(--radius-md)" }} />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚕</div>
            <p className="empty-state-title">No rides yet</p>
            <p>Book your first cab and it will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {bookings.map((b, i) => (
              <div key={b._id} className="panel" style={{ padding: 0, overflow: "hidden", animationDelay: `${i * 40}ms` }}>
                {/* Card header */}
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: "1.4rem" }}>🚗</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {b.pickupCity} → {b.dropCity}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800, color: "var(--accent-light)", fontSize: "1.05rem" }}>₹{b.fare}</span>
                    <span className={statusBadge(b.status)}>{b.status}</span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{
                  padding: "14px 20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "10px 24px",
                }}>
                  {[
                    { label: "Car", value: b.car?.carModel || "-" },
                    { label: "Car No", value: b.car?.carNo || "-" },
                    { label: "Driver", value: b.driver?.name || "Unassigned" },
                    { label: "Pickup", value: `${b.pickupTime}, ${new Date(b.pickupDate).toLocaleDateString()}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", fontWeight: 500 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {b.status === "Pending" && (
                    <>
                      <button className="btn-edit" onClick={() => { setRescheduleId(b._id); setNewDate(""); setNewTime(""); }}>
                        📅 Reschedule
                      </button>
                      <button className="btn-delete" onClick={() => setCancelId(b._id)}>
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  <button className="btn-info" style={{ marginLeft: "auto" }} onClick={() => downloadReceipt(b._id)}>
                    📄 Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
