import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => setForm({ name: r.data.name || "", email: r.data.email || "", phone: r.data.phone || "" }))
      .catch(() => setError("Could not load user"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.put(`/users/${id}`, form);
      setSuccess("User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper" style={{ maxWidth: 560 }}>
        <div className="page-header">
          <h1 className="page-title">Edit User</h1>
          <p className="page-subtitle">Update user account details</p>
        </div>
        <div className="panel" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", icon: "👤", type: "text" },
              { label: "Email Address", name: "email", icon: "✉", type: "email" },
              { label: "Phone Number", name: "phone", icon: "📱", type: "text" },
            ].map(({ label, name, icon, type }) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">{icon}</span>
                  <input type={type} name={name} value={form[name]} onChange={handleChange} required={name !== "phone"} />
                </div>
              </div>
            ))}
            {error   && <div className="alert alert-error">⚠ {error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate("/admin/users")}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> : "✓ Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
