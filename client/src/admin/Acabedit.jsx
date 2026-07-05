import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Acabedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ driverName: "", carModel: "", carType: "", carNo: "", price: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(res => {
        const { driverName, carModel, carType, carNo, price, carImage } = res.data;
        setForm({ driverName, carModel, carType, carNo, price });
        if (carImage) setPreview(`http://localhost:8000${carImage}`);
      })
      .catch(() => setError("Could not load car details"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append("carImage", imageFile);
      await api.put(`/cars/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Car updated successfully!");
      setTimeout(() => navigate("/admin/cabs"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper" style={{ maxWidth: 680 }}>
        <div className="page-header">
          <h1 className="page-title">Edit Car</h1>
          <p className="page-subtitle">Update vehicle details</p>
        </div>
        <div className="panel" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Driver Name", name: "driverName", icon: "👤" },
                { label: "Car Model", name: "carModel", icon: "🚗" },
                { label: "Car Type", name: "carType", icon: "🏷" },
                { label: "Car Number", name: "carNo", icon: "🪪" },
              ].map(({ label, name, icon }) => (
                <div className="form-group" key={name} style={{ marginBottom: 0 }}>
                  <label>{label}</label>
                  <div className="input-icon-wrap">
                    <span className="input-icon">{icon}</span>
                    <input name={name} value={form[name]} onChange={handleChange} required />
                  </div>
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Price per km (₹)</label>
              <div className="input-icon-wrap">
                <span className="input-icon">💰</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Car Image</label>
              <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: 20, textAlign: "center", cursor: "pointer", background: "var(--bg-elevated)" }}
                onClick={() => document.getElementById("editCarImg").click()}
              >
                {preview ? <img src={preview} alt="Preview" style={{ maxHeight: 140, borderRadius: "var(--radius-md)", margin: "0 auto" }} /> : <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>📸 Click to change image</p>}
                <input id="editCarImg" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
              </div>
            </div>
            {error   && <div className="alert alert-error">⚠ {error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate("/admin/cabs")}>← Back</button>
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

export default Acabedit;
