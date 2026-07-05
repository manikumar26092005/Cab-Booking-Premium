import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import api from "../api";

const Cabs = () => {
  const [cabs, setCabs] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCabs(); }, []);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchCabs(); };

  const setSort_ = (val) => { setSort(val); setTimeout(fetchCabs, 0); };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="cab-card" style={{ padding: 0 }}>
      <div className="skeleton" style={{ height: 160, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton skeleton-text" style={{ width: "60%", height: 16, marginBottom: 10 }} />
        <div className="skeleton skeleton-text" style={{ width: "80%", height: 12 }} />
        <div className="skeleton skeleton-text" style={{ width: "70%", height: 12 }} />
        <div className="skeleton" style={{ height: 36, marginTop: 12, borderRadius: "var(--radius-md)" }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <UserNavbar />
      <div className="page page-wrapper">

        <div className="page-header">
          <h1 className="page-title">Available Cabs</h1>
          <p className="page-subtitle">Choose from our fleet of professional drivers</p>
        </div>

        {/* Search & Filter toolbar */}
        <form className="toolbar" onSubmit={handleSearchSubmit}>
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 160 }}>
            <span className="input-icon">🔍</span>
            <input
              placeholder="Search car or driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 140 }}>
            <span className="input-icon">🚗</span>
            <input
              placeholder="Car type..."
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ maxWidth: "100%" }}
            />
          </div>
          <button type="submit" className="btn btn-accent" style={{ padding: "9px 20px" }}>Search</button>
          <button
            type="button"
            className={`sort-btn ${sort === "asc" ? "active" : ""}`}
            onClick={() => setSort_("asc")}
          >↑ Price Low</button>
          <button
            type="button"
            className={`sort-btn ${sort === "desc" ? "active" : ""}`}
            onClick={() => setSort_("desc")}
          >↓ Price High</button>
          {(search || typeFilter || sort) && (
            <button type="button" className="btn-ghost" onClick={() => { setSearch(""); setTypeFilter(""); setSort(""); setTimeout(fetchCabs, 0); }}>
              ✕ Clear
            </button>
          )}
        </form>

        {/* Results count */}
        {!loading && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 16 }}>
            {cabs.length} cab{cabs.length !== 1 ? "s" : ""} found
          </p>
        )}

        {loading ? (
          <div className="cab-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : cabs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚕</div>
            <p className="empty-state-title">No cabs found</p>
            <p>Try adjusting your search filters.</p>
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
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                    <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 600 }}>
                      {cab.carType}
                    </span>
                  </div>
                  <span className="cab-meta">🪪 {cab.carNo}</span>
                  <span className="cab-meta">👤 {cab.driverName}</span>
                  <div className="cab-price">₹{cab.price}<span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>/km</span></div>
                </div>
                <div className="cab-actions">
                  <button className="btn-book" style={{ flex: 1 }} onClick={() => navigate(`/bookcab/${cab._id}`)}>
                    Book Cab →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cabs;
