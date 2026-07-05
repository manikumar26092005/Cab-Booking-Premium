import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    api.get("/users").then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    try { await api.delete(`/users/${deleteId}`); setDeleteId(null); fetchUsers(); }
    catch (err) { console.error(err); }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminNavbar />
      <div className="page page-wrapper">
        <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage registered user accounts</p>
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>⚠ Delete this user?</h3>
              <p>This will permanently remove the user account and all associated data.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn-delete" style={{ padding: "9px 20px" }} onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="toolbar">
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <span className="input-icon">🔍</span>
            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: "100%" }} />
          </div>
          {search && <button className="btn btn-ghost" onClick={() => setSearch("")}>✕ Clear</button>}
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 10 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: "var(--radius-lg)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-title">No users found</p>
            <p>Try adjusting your search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((u, i) => (
              <div key={u._id} className="panel" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 30}ms` }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, var(--accent-dark), var(--accent-light))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, color: "var(--text-inverse)", flexShrink: 0, fontSize: "0.9rem"
                }}>
                  {u.name ? u.name[0].toUpperCase() : "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{u.email}</p>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{u._id.slice(-8).toUpperCase()}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-edit" onClick={() => navigate(`/admin/users/${u._id}/edit`)}>✎ Edit</button>
                  <button className="btn-delete" onClick={() => setDeleteId(u._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
