import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const C = {
  cream: "#f5f2ec",
  darkGreen: "#0a3026",
  rust: "#c25942",
  muted: "#666",
  border: "rgba(0,0,0,0.09)",
};

const serif = "'Playfair Display', serif";
const body  = "'EB Garamond', Georgia, serif";

const PROFILE_PICS = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVhlIIiKC3ow_uxswneWfAjSk5Zutw-TLTBw&s",
  "https://i.pinimg.com/736x/ec/f8/ce/ecf8ce936874540a65ea1e1e4ccaf26d.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9VeKAzzSm-KHRQ48PjwEhEozg4otym_Hu2A&s",
  "https://i.pinimg.com/736x/ec/f8/ce/ecf8ce936874540a65ea1e1e4ccaf26d.jpg",
  "https://www.belmont.edu/profiles/mary-claire-dismukes/_images/mary-claire-dismukes.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj5-CC8IqhXvWgD1OYsCfT4IChGKsrBA7xvw&s",
];

function MentorshipModal({ alumni, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!message.trim()) { toast.error("Please write a message."); return; }
    setLoading(true);
    try {
      await api.post("/mentorship", { alumni_id: alumni.id, message });
      toast.success(`Request sent to ${alumni.name}`);
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to send request");
    }
    setLoading(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,48,38,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.cream, width: "100%", maxWidth: 480,
          padding: "2.5rem", position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1.2rem",
            background: "none", border: "none", fontSize: "1.3rem",
            cursor: "pointer", color: C.muted, lineHeight: 1,
          }}
        >&times;</button>

        <div style={{
          fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
          color: C.rust, fontWeight: 700, marginBottom: "0.6rem",
          borderTop: `1px solid ${C.rust}`, paddingTop: "0.4rem", display: "inline-block",
        }}>Mentorship Request</div>
        <h2 style={{
          fontFamily: serif, fontSize: "1.6rem", color: C.darkGreen,
          fontWeight: 400, marginBottom: "0.4rem",
        }}>Write to {alumni.name}</h2>
        <p style={{ color: C.muted, fontSize: "0.9rem", marginBottom: "1.6rem" }}>
          {alumni.industry} {alumni.graduation_year ? `· Class of ${alumni.graduation_year}` : ""}
        </p>

        <label style={{
          display: "block", fontSize: "0.78rem", letterSpacing: "0.1em",
          textTransform: "uppercase", color: C.darkGreen, marginBottom: "0.5rem", fontWeight: 600,
        }}>Your message</label>
        <textarea
          rows={5}
          placeholder="Introduce yourself and explain what kind of guidance you're looking for..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            width: "100%", border: `1px solid ${C.border}`,
            background: "#fff", padding: "0.85rem 1rem",
            fontSize: "0.95rem", fontFamily: body, color: "#2c2c2c",
            outline: "none", resize: "vertical", boxSizing: "border-box",
            marginBottom: "1.4rem",
          }}
        />

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: C.darkGreen, color: "#fff", border: "none",
              padding: "0.8rem 2rem", fontSize: "0.95rem",
              fontFamily: body, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.03em", opacity: loading ? 0.7 : 1,
            }}
          >{loading ? "Sending..." : "Send Request"}</button>
          <button
            onClick={onClose}
            style={{
              background: "transparent", color: C.muted,
              border: `1px solid ${C.border}`,
              padding: "0.8rem 1.6rem", fontSize: "0.95rem",
              fontFamily: body, cursor: "pointer",
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Directory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [users, setUsers]             = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [query, setQuery]             = useState("");
  const [role, setRole]               = useState(searchParams.get("role") || "");
  const [industry, setIndustry]       = useState("");
  const [modalAlumni, setModalAlumni] = useState(null);
  // Set of user IDs who have accepted your connection request (or you accepted theirs)
  const [connectedIds, setConnectedIds] = useState(new Set());
  // Set of user IDs where a connection request is pending
  const [pendingIds, setPendingIds]     = useState(new Set());

  useEffect(() => {
    api.get("/users").then(r => {
      setUsers(r.data);
      setFiltered(r.data);
    }).catch(() => {});
  }, []);

  // Load connections so we know who is accepted vs pending
  useEffect(() => {
    api.get("/connections").then(r => {
      const accepted = new Set();
      const pending  = new Set();
      (r.data || []).forEach(c => {
        const otherId = c.sender_id === user?.id ? c.receiver_id : c.sender_id;
        if (c.status === "accepted") accepted.add(otherId);
        else if (c.status === "pending") pending.add(otherId);
      });
      setConnectedIds(accepted);
      setPendingIds(pending);
    }).catch(() => {});
  }, [user?.id]);

  const applyFilters = () => {
    let res = [...users];
    if (query)    res = res.filter(u =>
      `${u.name} ${u.bio ?? ""} ${(u.skills ?? []).join(" ")}`.toLowerCase().includes(query.toLowerCase())
    );
    if (role)     res = res.filter(u => u.role === role);
    if (industry) res = res.filter(u => (u.industry ?? "").toLowerCase().includes(industry.toLowerCase()));
    setFiltered(res);
  };

  const sendConnect = async (targetId) => {
    try {
      await api.post("/connections", { receiver_id: targetId });
      setPendingIds(prev => new Set([...prev, targetId]));
      toast.success("Connection request sent.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to send request");
    }
  };

  const roleLabel = (u) => {
    const r = u.role?.charAt(0).toUpperCase() + u.role?.slice(1);
    return u.graduation_year ? `${r} · ${u.graduation_year}` : r;
  };

  // Shared button base style
  const btnBase = {
    width: "100%", padding: "0.6rem 1rem",
    fontSize: "0.82rem", fontFamily: body,
    cursor: "pointer", letterSpacing: "0.04em",
    transition: "all 0.15s",
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: body }}>
      {modalAlumni && (
        <MentorshipModal alumni={modalAlumni} onClose={() => setModalAlumni(null)} />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem 2.5rem" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{
            fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.rust, fontWeight: 700, marginBottom: "0.7rem",
            borderTop: `1px solid ${C.rust}`, paddingTop: "0.4rem", display: "inline-block",
          }}>The Directory</div>
          <h1 style={{
            fontFamily: serif, fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: C.darkGreen, fontWeight: 400, margin: 0,
          }}>Every face in the network.</h1>
        </div>

        {/* FILTERS */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto auto auto",
          gap: "0.75rem", alignItems: "center",
          border: `1px solid ${C.border}`, background: "#fff",
          padding: "1.2rem 1.4rem", marginBottom: "2.5rem",
        }}>
          <input
            placeholder="Search name, skill, bio..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
            style={{
              border: `1px solid ${C.border}`, padding: "0.7rem 1rem",
              fontSize: "0.9rem", fontFamily: body, background: C.cream,
              color: "#2c2c2c", outline: "none",
            }}
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              border: `1px solid ${C.border}`, padding: "0.7rem 1rem",
              fontSize: "0.9rem", fontFamily: body, background: C.cream,
              color: "#2c2c2c", outline: "none", minWidth: 140,
            }}
          >
            <option value="">All Roles</option>
            <option value="alumni">Alumni</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <input
            placeholder="Industry"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
            style={{
              border: `1px solid ${C.border}`, padding: "0.7rem 1rem",
              fontSize: "0.9rem", fontFamily: body, background: C.cream,
              color: "#2c2c2c", outline: "none", minWidth: 160,
            }}
          />
          <button
            onClick={applyFilters}
            style={{
              background: C.darkGreen, color: "#fff", border: "none",
              padding: "0.7rem 1.6rem", fontSize: "0.9rem", fontFamily: body,
              cursor: "pointer", letterSpacing: "0.03em",
            }}
          >Apply</button>
        </div>

        {/* RESULTS COUNT */}
        <div style={{
          fontSize: "0.78rem", color: C.muted, marginBottom: "1.2rem",
          letterSpacing: "0.05em",
        }}>
          {filtered.length} {filtered.length === 1 ? "member" : "members"} found
        </div>

        {/* USER GRID */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", background: C.border, border: `1px solid ${C.border}`,
        }}>
          {filtered.map((u, i) => {
            const isMe        = u.id === user?.id;
            const isConnected = connectedIds.has(u.id);
            const isPending   = pendingIds.has(u.id);

            return (
              <div
                key={u.id}
                style={{
                  background: C.cream, padding: "2rem 1.8rem",
                  transition: "background 0.18s", cursor: "pointer",
                  height: "100%", display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                onMouseLeave={e => e.currentTarget.style.background = C.cream}
              >
                <Link to={`/profile/${u.id}`} style={{ textDecoration: "none", flex: 1 }}>
                  {/* Photo */}
                  <img
                    src={PROFILE_PICS[i % PROFILE_PICS.length]}
                    alt={u.name}
                    style={{
                      width: 60, height: 60, borderRadius: "50%",
                      objectFit: "cover", display: "block",
                      marginBottom: "1.1rem", border: `2px solid ${C.border}`,
                    }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                  <div style={{
                    display: "none", width: 60, height: 60, borderRadius: "50%",
                    background: C.darkGreen, color: "#fff",
                    alignItems: "center", justifyContent: "center",
                    fontFamily: serif, fontSize: "1.4rem", marginBottom: "1.1rem",
                  }}>{u.name?.[0]}</div>

                  {/* Role */}
                  <div style={{
                    fontSize: "0.6rem", letterSpacing: "0.18em",
                    textTransform: "uppercase", color: C.rust,
                    fontWeight: 700, marginBottom: "0.5rem",
                  }}>{roleLabel(u)}</div>

                  {/* Name */}
                  <div style={{
                    fontFamily: serif, fontSize: "1.25rem",
                    color: C.darkGreen, marginBottom: "0.4rem", fontWeight: 400,
                  }}>{u.name}</div>

                  {/* Industry */}
                  {u.industry && (
                    <div style={{ fontSize: "0.88rem", color: C.muted, marginBottom: "0.4rem" }}>
                      {u.industry}
                    </div>
                  )}

                  {/* Bio */}
                  {u.bio && (
                    <div style={{
                      fontSize: "0.85rem", color: C.muted, lineHeight: 1.55,
                      marginBottom: "0.9rem",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{u.bio}</div>
                  )}

                  {/* Skills */}
                  {u.skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
                      {u.skills.slice(0, 4).map(skill => (
                        <span key={skill} style={{
                          border: `1px solid ${C.border}`, padding: "0.2rem 0.6rem",
                          fontSize: "0.68rem", letterSpacing: "0.08em",
                          textTransform: "uppercase", color: "#2c2c2c", background: "#fff",
                        }}>{skill}</span>
                      ))}
                    </div>
                  )}
                </Link>

                {/* Action buttons — not shown for own card */}
                {!isMe && (
                  <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>

                    {/* Message — only if accepted connection */}
                    {isConnected && (
                      <button
                        onClick={() => navigate(`/messages?to=${u.id}`)}
                        style={{
                          ...btnBase,
                          background: C.darkGreen, color: "#fff",
                          border: `1px solid ${C.darkGreen}`,
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        Message
                      </button>
                    )}

                    {/* Connect — only if not connected and not pending */}
                    {!isConnected && !isPending && (
                      <button
                        onClick={() => sendConnect(u.id)}
                        style={{
                          ...btnBase,
                          background: "transparent", color: C.darkGreen,
                          border: `1px solid ${C.darkGreen}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.darkGreen; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.darkGreen; }}
                      >
                        Connect
                      </button>
                    )}

                    {/* Pending state */}
                    {isPending && (
                      <button
                        disabled
                        style={{
                          ...btnBase,
                          background: "transparent", color: C.muted,
                          border: `1px solid ${C.border}`,
                          cursor: "not-allowed",
                        }}
                      >
                        Request Sent
                      </button>
                    )}

                    {/* Request Mentorship — alumni only, visible to students */}
                    {u.role === "alumni" && user?.role === "student" && (
                      <button
                        onClick={() => setModalAlumni(u)}
                        style={{
                          ...btnBase,
                          background: "transparent", color: C.rust,
                          border: `1px solid ${C.rust}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.rust; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rust; }}
                      >
                        Request Mentorship
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            color: C.muted, fontFamily: serif, fontSize: "1.2rem",
          }}>
            No members match your search.
          </div>
        )}
      </div>
    </div>
  );
}