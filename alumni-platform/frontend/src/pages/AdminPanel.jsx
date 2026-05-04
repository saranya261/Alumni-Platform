import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 22px",
        fontFamily: "inherit",
        fontSize: "13px",
        fontWeight: active ? "600" : "400",
        background: active ? "#2d4a3e" : "transparent",
        color: active ? "#fff" : "#5a6a5e",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function Badge({ text, color }) {
  const colors = {
    admin: { bg: "#fef3c7", text: "#92400e" },
    alumni: { bg: "#d1fae5", text: "#065f46" },
    student: { bg: "#dbeafe", text: "#1e40af" },
  };
  const c = colors[color] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600 }}>
      {text}
    </span>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`, { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch { setMsg("Failed to load users"); }
    setLoading(false);
  }

  async function deleteUser(id, name) {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { setMsg(`Deleted ${name}`); fetchUsers(); }
      else { const d = await res.json(); setMsg(d.detail || "Delete failed"); }
    } catch { setMsg("Error deleting user"); }
  }

  async function changeRole(id, role) {
    try {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) { setMsg("Role updated"); fetchUsers(); }
      else { const d = await res.json(); setMsg(d.detail || "Update failed"); }
    } catch { setMsg("Error updating role"); }
  }

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading users...</p>;

  return (
    <div>
      {msg && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {msg} <button onClick={() => setMsg("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#065f46" }}>✕</button>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              {["Name", "Email", "Role", "Industry", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id || u.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px", fontWeight: 500, color: "#111" }}>{u.name}</td>
                <td style={{ padding: "12px", color: "#6b7280" }}>{u.email}</td>
                <td style={{ padding: "12px" }}><Badge text={u.role} color={u.role} /></td>
                <td style={{ padding: "12px", color: "#6b7280" }}>{u.industry || "—"}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u._id || u.id, e.target.value)}
                      style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #d1d5db", color: "#374151", cursor: "pointer" }}
                    >
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => deleteUser(u._id || u.id, u.name)}
                      style={{ padding: "4px 10px", fontSize: "12px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>No users found</p>}
      </div>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${API}/messages/admin/all`, { credentials: "include" });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : data.messages || []);
      } catch { }
      setLoading(false);
    }
    fetchMessages();
  }, []);

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading messages...</p>;

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
            {["From", "To", "Message", "Date"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messages.map(m => (
            <tr key={m._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px", fontWeight: 500, color: "#111" }}>{m.senderName || m.senderId}</td>
              <td style={{ padding: "12px", color: "#6b7280" }}>{m.receiverName || m.receiverId}</td>
              <td style={{ padding: "12px", color: "#374151", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.content}</td>
              <td style={{ padding: "12px", color: "#9ca3af", fontSize: "12px" }}>{new Date(m.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {messages.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>No messages found</p>}
    </div>
  );
}

function OpportunitiesTab() {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchOpps(); }, []);

  async function fetchOpps() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/opportunities`, { credentials: "include" });
      const data = await res.json();
      setOpps(Array.isArray(data) ? data : data.opportunities || []);
    } catch { }
    setLoading(false);
  }

  async function deleteOpp(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API}/opportunities/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { setMsg(`Deleted "${title}"`); fetchOpps(); }
      else { const d = await res.json(); setMsg(d.detail || "Delete failed"); }
    } catch { setMsg("Error deleting opportunity"); }
  }

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading opportunities...</p>;

  return (
    <div>
      {msg && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {msg} <button onClick={() => setMsg("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
            {["Title", "Company", "Type", "Location", "Posted By", "Actions"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {opps.map(o => (
            <tr key={o._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px", fontWeight: 500, color: "#111" }}>{o.title}</td>
              <td style={{ padding: "12px", color: "#6b7280" }}>{o.company}</td>
              <td style={{ padding: "12px" }}>
                <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600 }}>{o.job_type}</span>
              </td>
              <td style={{ padding: "12px", color: "#6b7280" }}>{o.location}</td>
              <td style={{ padding: "12px", color: "#6b7280" }}>{o.postedByName}</td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => deleteOpp(o._id, o.title)}
                  style={{ padding: "4px 10px", fontSize: "12px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {opps.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>No opportunities found</p>}
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState("users");

  const tabs = [
    { key: "users", label: "Manage Users" },
    { key: "messages", label: "All Messages" },
    { key: "opportunities", label: "Opportunities" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "#2d4a3e", color: "#fff", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#86b8a0", textTransform: "uppercase", marginBottom: "4px" }}>Alumnae Network</div>
          <h1 style={{ fontSize: "22px", fontWeight: 400, margin: 0 }}>Admin Panel</h1>
        </div>
        <a href="/dashboard" style={{ color: "#86b8a0", fontSize: "13px", textDecoration: "none" }}>← Back to Dashboard</a>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 40px", display: "flex", gap: "0" }}>
        {tabs.map(t => (
          <TabBtn key={t.key} label={t.label} active={tab === t.key} onClick={() => setTab(t.key)} />
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 24px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          {tab === "users" && <UsersTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "opportunities" && <OpportunitiesTab />}
        </div>
      </div>
    </div>
  );
}