import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const Login = () => {
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
      const res = await api.post("/users/login", form);
      login(res.data.token, "user", res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <nav className="navbar">
        <Link to="/" className="brand">🚕 UCab</Link>
        <div className="nav-links">
          <Link to="/admin/login">Admin</Link>
          <Link to="/driver/login">Driver</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        {/* Background blobs */}
        <div className="hero-blob" style={{ width: 300, height: 300, background: "var(--accent)", top: "10%", left: "-5%", opacity: 0.07 }} />
        <div className="hero-blob" style={{ width: 250, height: 250, background: "#3b82f6", bottom: "10%", right: "-5%", opacity: 0.07 }} />

        <div className="form-card" style={{ position: "relative", zIndex: 1 }}>
          <div className="form-card-logo">🚕</div>
          <h2>Welcome back</h2>
          <p className="form-card-desc">Sign in to your UCab account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✉</span>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            {error && (
              <div className="alert alert-error">⚠ {error}</div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "Sign In →"}
            </button>
          </form>

          <p className="switch-text">Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent-light)", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
