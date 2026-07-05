import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Dregister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.post("/drivers/register", form);
      setSuccess("Registered! Redirecting to login...");
      setTimeout(() => navigate("/driver/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <nav className="navbar">
        <Link to="/" className="brand">🚗 UCab Driver</Link>
        <div className="nav-links"><Link to="/driver/login">Driver Login</Link></div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="form-card">
          <div className="form-card-logo" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>🚗</div>
          <h2>Become a Driver</h2>
          <p className="form-card-desc">Register to start earning with UCab</p>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Your full name", icon: "👤" },
              { label: "Email Address", name: "email", type: "email", placeholder: "driver@example.com", icon: "✉" },
              { label: "Phone Number", name: "phone", type: "text", placeholder: "+91 00000 00000", icon: "📱" },
              { label: "Password", name: "password", type: "password", placeholder: "Min 6 characters", icon: "🔒" },
            ].map(({ label, name, type, placeholder, icon }) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">{icon}</span>
                  <input type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} required={name !== "phone"} />
                </div>
              </div>
            ))}
            {error   && <div className="alert alert-error">⚠ {error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 20, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "Register as Driver →"}
            </button>
          </form>
          <p className="switch-text">Already registered?{" "}<Link to="/driver/login" style={{ color: "#60a5fa", fontWeight: 600 }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Dregister;
