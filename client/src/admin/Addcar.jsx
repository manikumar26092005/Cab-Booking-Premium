import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Addcar = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    driverName: "",
    driverEmail: "",
    driverPhone: "",
    carModel: "",
    carType: "",
    carNo: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/cars/categories")
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (imageFile) {
        data.append("carImage", imageFile);
      }

      await api.post("/cars", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Car added successfully!");

      setTimeout(() => {
        navigate("/admin/cabs");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Driver Name",
      name: "driverName",
      placeholder: "e.g. Rahul Sharma",
      icon: "👤",
    },
    {
      label: "Driver Email",
      name: "driverEmail",
      placeholder: "e.g. rahul@gmail.com",
      icon: "📧",
      type: "email",
    },
    {
      label: "Driver Phone",
      name: "driverPhone",
      placeholder: "e.g. 9876543210",
      icon: "📱",
    },
    {
      label: "Car Model",
      name: "carModel",
      placeholder: "e.g. Maruti Swift",
      icon: "🚗",
    },
    {
      label: "Car Number",
      name: "carNo",
      placeholder: "e.g. AP39AB1234",
      icon: "🪪",
    },
    {
      label: "Price per km (₹)",
      name: "price",
      placeholder: "e.g. 12",
      icon: "💰",
      type: "number",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />

      <div className="page page-wrapper" style={{ maxWidth: 720 }}>
        <div className="page-header">
          <h1 className="page-title">Add New Car</h1>
          <p className="page-subtitle">
            Add a vehicle to the UCab fleet
          </p>
        </div>

        <div className="panel" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {fields.map(
                ({
                  label,
                  name,
                  placeholder,
                  icon,
                  type = "text",
                }) => (
                  <div
                    className="form-group"
                    key={name}
                    style={{ marginBottom: 0 }}
                  >
                    <label>{label}</label>

                    <div className="input-icon-wrap">
                      <span className="input-icon">{icon}</span>

                      <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Car Type / Category</label>

              <div className="input-icon-wrap">
                <span className="input-icon">🏷</span>

                <input
                  name="carType"
                  placeholder="e.g. Sedan, SUV, Hatchback"
                  value={form.carType}
                  onChange={handleChange}
                  list="carTypeList"
                  required
                />

                <datalist id="carTypeList">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}

                  {[
                    "Mini",
                    "Sedan",
                    "SUV",
                    "Hatchback",
                    "Bike",
                    "Luxury",
                  ].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-group">
              <label>Car Image</label>

              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: 24,
                  textAlign: "center",
                  cursor: "pointer",
                  background: preview
                    ? "transparent"
                    : "var(--bg-elevated)",
                }}
                onClick={() =>
                  document.getElementById("carImageInput").click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();

                  const file = e.dataTransfer.files[0];

                  if (file) {
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxHeight: 180,
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "2rem",
                        marginBottom: 10,
                      }}
                    >
                      📸
                    </div>

                    <p>Click or Drag & Drop Image</p>

                    <small>
                      PNG / JPG / WEBP (Max 5MB)
                    </small>
                  </>
                )}

                <input
                  id="carImageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => navigate("/admin/cabs")}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? "Adding..." : "➕ Add Car"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addcar;