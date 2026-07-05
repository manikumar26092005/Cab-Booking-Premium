import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const Alogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/admin/login", form);
      login(res.data.token, "admin", res.data.admin);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <nav className="navbar">
        <Link to="/" className="brand">🛠 UCab Admin</Link>
        <div className="nav-links">
          <Link to="/login">User Login</Link>
          <Link to="/driver/login">Driver Login</Link>
        </div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="hero-blob" style={{ width: 350, height: 350, background: "#8b5cf6", top: "5%", left: "-5%", opacity: 0.07 }} />
        <div className="form-card" style={{ position: "relative", zIndex: 1 }}>
          <div className="form-card-logo" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>🛠</div>
          <h2>Admin Portal</h2>
          <p className="form-card-desc">Manage users, drivers & bookings</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✉</span>
                <input type="email" name="email" placeholder="admin@ucab.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            {error && <div className="alert alert-error">⚠ {error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 20, background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "Access Admin Panel →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Alogin;
