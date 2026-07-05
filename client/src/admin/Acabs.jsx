import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Acabs = () => {
  const [cabs, setCabs] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchCabs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (sort) params.sort = sort;
      const res = await api.get("/cars", { params });
      setCabs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchCabs();
    api.get("/cars/categories").then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleDelete = async () => {
    try { await api.delete(`/cars/${deleteId}`); setDeleteId(null); fetchCabs(); }
    catch (err) { console.error(err); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">

        <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Car Fleet</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage all vehicles in the platform</p>
          </div>
          <button className="btn btn-accent" style={{ padding: "9px 20px" }} onClick={() => navigate("/admin/add-cab")}>
            ➕ Add Car
          </button>
        </div>

        {/* Delete modal */}
        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>⚠ Delete this car?</h3>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn-delete" style={{ padding: "9px 20px" }} onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <form className="toolbar" onSubmit={e => { e.preventDefault(); fetchCabs(); }}>
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 180 }}>
            <span className="input-icon">🔍</span>
            <input placeholder="Search car model or driver..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: "100%" }} />
          </div>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setTimeout(fetchCabs, 0); }} style={{ minWidth: 150 }}>
            <option value="">All Types</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn btn-accent" style={{ padding: "9px 16px" }}>Search</button>
          <button
            type="button"
            className={`sort-btn ${sort === "asc" ? "active" : ""}`}
            onClick={() => { setSort("asc"); setTimeout(fetchCabs, 0); }}
          >↑ Price Low</button>
          <button
            type="button"
            className={`sort-btn ${sort === "desc" ? "active" : ""}`}
            onClick={() => { setSort("desc"); setTimeout(fetchCabs, 0); }}
          >↓ Price High</button>
          {(search || typeFilter || sort) && (
            <button type="button" className="btn btn-ghost" onClick={() => { setSearch(""); setTypeFilter(""); setSort(""); setTimeout(fetchCabs, 0); }}>✕ Clear</button>
          )}
        </form>

        {loading ? (
          <div className="cab-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="cab-card" style={{ padding: 0 }}>
                <div className="skeleton" style={{ height: 160, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
                <div style={{ padding: 16 }}>
                  <div className="skeleton skeleton-text" style={{ width: "60%" }} />
                  <div className="skeleton skeleton-text" style={{ width: "80%" }} />
                  <div className="skeleton skeleton-text" style={{ width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : cabs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <p className="empty-state-title">No cars found</p>
            <p>Try adjusting your filters or add a new car.</p>
          </div>
        ) : (
          <div className="cab-grid">
            {cabs.map((cab, i) => (
              <div className="cab-card" key={cab._id} style={{ animationDelay: `${i * 50}ms` }}>
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={cab.carImage ? `http://localhost:8000${cab.carImage}` : `https://placehold.co/400x200/1e2a3a/f59e0b?text=${encodeURIComponent(cab.carModel)}`}
                    alt={cab.carModel}
                    style={{ height: 160, width: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="cab-body">
                  <strong>{cab.carModel}</strong>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 600 }}>
                      {cab.carType}
                    </span>
                  </div>
                  <span className="cab-meta">🪪 {cab.carNo}</span>
                  <span className="cab-meta">👤 {cab.driverName}</span>
                  <div className="cab-price">₹{cab.price}<span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>/km</span></div>
                </div>
                <div className="cab-actions">
                  <button className="btn-edit" style={{ flex: 1 }} onClick={() => navigate(`/admin/cabs/${cab._id}/edit`)}>✎ Edit</button>
                  <button className="btn-delete" onClick={() => setDeleteId(cab._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Acabs;
