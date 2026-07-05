import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import api from "../api";

const BookCab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pickupState: "", pickupCity: "", dropState: "", dropCity: "",
    pickupDate: "", pickupTime: "", dropDate: "", dropTime: "",
    estimatedKm: 10, isScheduled: false,
  });

  useEffect(() => {
    api.get(`/cars/${id}`).then((res) => setCar(res.data)).catch(() => setError("Could not load cab details"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCalculateFare = () => {
    if (!car) return;
    const km = Number(form.estimatedKm) || 10;
    setEstimatedFare(Math.round(car.price * km));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.post("/bookings", { carId: id, ...form });
      setSuccess("🎉 Ride booked successfully! Redirecting...");
      setTimeout(() => navigate("/my-bookings"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally { setLoading(false); }
  };

  const inputRow = (label, fields) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${fields.length}, 1fr)`, gap: 12 }}>
      {fields.map(f => (
        <div className="form-group" key={f.name} style={{ marginBottom: 0 }}>
          <label>{label} {f.sub}</label>
          <input {...f} onChange={handleChange} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <UserNavbar />
      <div className="page page-wrapper" style={{ maxWidth: 720 }}>

        <div className="page-header">
          <h1 className="page-title">Book a Ride</h1>
          <p className="page-subtitle">Fill in the details to confirm your booking</p>
        </div>

        {/* Car summary card */}
        {car && (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-active)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 20,
            animation: "slideDown 0.3s var(--ease)",
          }}>
            <div style={{ fontSize: "2.5rem" }}>🚗</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 2 }}>{car.carModel}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                {car.carType} · {car.carNo} · Driver: {car.driverName}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-light)" }}>₹{car.price}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>per km</div>
            </div>
          </div>
        )}

        <div className="panel" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>

            {/* Pickup */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                📍 Pickup Location
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>State</label>
                  <input name="pickupState" placeholder="e.g. Maharashtra" value={form.pickupState} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>City</label>
                  <input name="pickupCity" placeholder="e.g. Mumbai" value={form.pickupCity} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="gradient-line" style={{ margin: "16px 0" }} />

            {/* Drop */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                🏁 Drop Location
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>State</label>
                  <input name="dropState" placeholder="e.g. Karnataka" value={form.dropState} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>City</label>
                  <input name="dropCity" placeholder="e.g. Bangalore" value={form.dropCity} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="gradient-line" style={{ margin: "16px 0" }} />

            {/* Date/Time */}
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
              🕐 Schedule
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Pickup Date</label>
                <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Pickup Time</label>
                <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Drop Date <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>(optional)</span></label>
                <input type="date" name="dropDate" value={form.dropDate} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Drop Time <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>(optional)</span></label>
                <input type="time" name="dropTime" value={form.dropTime} onChange={handleChange} />
              </div>
            </div>

            {/* Distance & Fare Calculator */}
            <div className="gradient-line" style={{ margin: "16px 0" }} />
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
              💰 Fare Estimate
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Estimated Distance (km)</label>
                <input type="number" name="estimatedKm" value={form.estimatedKm} onChange={handleChange} min="1" />
              </div>
              <button type="button" className="btn btn-ghost" style={{ marginBottom: 0, height: 42 }} onClick={handleCalculateFare}>
                Calculate
              </button>
            </div>
            {estimatedFare !== null && (
              <div style={{
                background: "var(--accent-glow)",
                border: "1px solid var(--border-active)",
                borderRadius: "var(--radius-md)",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                animation: "zoomIn 0.25s var(--ease-spring)",
              }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Estimated Fare</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-light)" }}>₹{estimatedFare}</span>
              </div>
            )}

            {/* Schedule toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: 20 }}>
              <input
                type="checkbox"
                id="isScheduled"
                name="isScheduled"
                checked={form.isScheduled}
                onChange={handleChange}
                style={{ width: "auto", accentColor: "var(--accent)" }}
              />
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: 2 }}>📅 Schedule for later</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Book now, ride at your selected date & time</p>
              </div>
            </label>

            {error   && <div className="alert alert-error" style={{ marginBottom: 12 }}>⚠ {error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: 12 }}>✓ {success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "🚕 Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCab;
