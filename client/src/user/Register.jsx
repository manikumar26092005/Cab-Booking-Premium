import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.post("/users/register", form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <nav className="navbar">
        <Link to="/" className="brand">🚕 UCab</Link>
        <div className="nav-links">
          <Link to="/login">Sign In</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="hero-blob" style={{ width: 350, height: 350, background: "var(--accent)", top: "5%", right: "-5%", opacity: 0.07 }} />

        <div className="form-card" style={{ position: "relative", zIndex: 1 }}>
          <div className="form-card-logo">✨</div>
          <h2>Create account</h2>
          <p className="form-card-desc">Join UCab and ride smarter today</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <span className="input-icon">👤</span>
                <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
            </div>
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
                <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            {error   && <div className="alert alert-error">⚠ {error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "Create Account →"}
            </button>
          </form>

          <p className="switch-text">Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
