import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const Dlogin = () => {
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
      const res = await api.post("/drivers/login", form);
      login(res.data.token, "driver", res.data.driver);
      navigate("/driver/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <nav className="navbar">
        <Link to="/" className="brand">🚗 UCab Driver</Link>
        <div className="nav-links">
          <Link to="/login">User Login</Link>
          <Link to="/admin/login">Admin</Link>
        </div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="hero-blob" style={{ width: 300, height: 300, background: "#3b82f6", top: "10%", right: "-5%", opacity: 0.07 }} />
        <div className="form-card" style={{ position: "relative", zIndex: 1 }}>
          <div className="form-card-logo" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>🚗</div>
          <h2>Driver Login</h2>
          <p className="form-card-desc">Access your driver dashboard</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✉</span>
                <input type="email" name="email" placeholder="driver@example.com" value={form.email} onChange={handleChange} required />
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
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 20, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "Sign In as Driver →"}
            </button>
          </form>
          <p className="switch-text">New driver?{" "}<Link to="/driver/register" style={{ color: "#60a5fa", fontWeight: 600 }}>Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Dlogin;
