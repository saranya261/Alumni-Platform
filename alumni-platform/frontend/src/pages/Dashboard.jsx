import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const C = {
  cream: "#f5f2ec",
  darkGreen: "#0a3026",
  rust: "#c25942",
  muted: "#666",
  border: "rgba(0,0,0,0.09)",
};
const serif = "'Playfair Display', serif";
const body  = "'EB Garamond', Georgia, serif";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const QUICK_ACTIONS = [
  { label: "Browse Directory",   to: "/directory",  icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { label: "Find a Mentor",      to: "/mentorship", icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4l3 3" },
  { label: "View Opportunities", to: "/jobs",       icon: "M21 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5.5M3 8h18M8 2h8M12 12v6" },
  { label: "Open Messages",      to: "/messages",   icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

const ACTIVITY_ICONS = {
  mentorship:  "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  opportunity: "M21 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5.5M3 8h18M8 2h8",
  message:     "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
};

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [stats, setStats]         = useState({ alumni: 0, students: 0, jobs: 0, pending: 0 });
  const [unread, setUnread]       = useState(0);
  const [recentMsgs, setRecentMsgs] = useState([]);  // latest conversations
  const [activity, setActivity]   = useState([]);

  // ── Core data fetch ──
  const fetchAll = useCallback(async () => {
    try {
      const [a, s, o, r, convs] = await Promise.all([
        api.get("/users?role=alumni"),
        api.get("/users?role=student"),
        api.get("/opportunities"),
        api.get("/mentorship/my"),
        api.get("/messages/conversations"),
      ]);

      setStats({
        alumni:   a.data.length,
        students: s.data.length,
        jobs:     o.data.length,
        pending:  r.data.filter(x => x.status === "pending").length,
      });

      // ── Unread count: try unread_count field first, else count convs
      //    with a last_message that is newer than last_read_at
      const convList = convs.data || [];
      setRecentMsgs(convList.slice(0, 3));

      // Method 1 — backend sends unread_count per conversation
      const fromField = convList.reduce((acc, c) => acc + (c.unread_count ?? 0), 0);

      // Method 2 — fallback: count conversations where is_read === false
      const fromFlag  = convList.filter(c => c.is_read === false || c.unread === true).length;

      // Use whichever gives a non-zero result
      setUnread(fromField || fromFlag);

      // ── Activity feed from real data ──
      const mentorItems = r.data.slice(0, 2).map(m => ({
        id: m._id,
        type: "mentorship",
        text: m.status === "accepted"
          ? `${m.alumniName ?? m.studentName} accepted your mentorship request`
          : `Mentorship request with ${m.alumniName ?? m.studentName} is ${m.status}`,
        time: new Date(m.updatedAt ?? m.createdAt).toLocaleDateString(),
      }));
      const msgItems = convList.slice(0, 2).map(c => ({
        id: `msg-${c.other_id}`,
        type: "message",
        text: `${c.other_name}: "${c.last_message}"`,
        time: "",
      }));
      setActivity([...mentorItems, ...msgItems].slice(0, 4));

    } catch (_) {}
  }, []);

  // Initial load
  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Poll every 30 seconds so unread count stays fresh ──
  useEffect(() => {
    const interval = setInterval(fetchAll, 30_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const statCards = [
    { label: "Alumni",           value: stats.alumni,   to: "/directory?role=alumni",  note: "in the network",  highlight: false },
    { label: "Students",         value: stats.students, to: "/directory?role=student", note: "active members",  highlight: false },
    { label: "Opportunities",    value: stats.jobs,     to: "/jobs",                   note: "open roles",      highlight: false },
    { label: "Pending Requests", value: stats.pending,  to: "/mentorship",             note: "awaiting reply",  highlight: false },
    { label: "Unread Messages",  value: unread,         to: "/messages",               note: "new messages",    highlight: unread > 0 },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: body }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem 2.5rem" }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: "3rem", paddingBottom: "2rem", borderBottom: `1px solid ${C.border}`,
        }}>
          <div>
            <div style={{
              fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
              color: C.rust, fontWeight: 700, marginBottom: "0.6rem",
            }}>Dashboard</div>
            <h1 style={{
              fontFamily: serif, fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
              color: C.darkGreen, fontWeight: 400, margin: 0, lineHeight: 1.1,
            }}>Welcome, {firstName}.</h1>
            <p style={{ color: C.muted, marginTop: "0.5rem", fontSize: "0.95rem" }}>
              Here's what's happening in your network today.
            </p>
          </div>
          <div style={{ fontSize: "0.8rem", color: C.muted, textAlign: "right", lineHeight: 1.6 }}>
            <div style={{ fontFamily: serif, fontSize: "1rem", color: C.darkGreen }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1px", background: C.border, border: `1px solid ${C.border}`,
          marginBottom: "2.5rem",
        }}>
          {statCards.map((s) => (
            <Link key={s.label} to={s.to} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: s.highlight ? C.darkGreen : C.cream,
                  padding: "2rem 1.5rem", transition: "background 0.2s",
                  cursor: "pointer", position: "relative",
                }}
                onMouseEnter={e => e.currentTarget.style.background = s.highlight ? "#0d3d2e" : "#fff"}
                onMouseLeave={e => e.currentTarget.style.background = s.highlight ? C.darkGreen : C.cream}
              >
                {s.highlight && (
                  <span style={{
                    position: "absolute", top: 12, right: 12,
                    width: 10, height: 10, borderRadius: "50%",
                    background: C.rust,
                  }} />
                )}
                <div style={{
                  fontFamily: serif, fontSize: "3rem",
                  color: s.highlight ? "#fff" : C.darkGreen,
                  lineHeight: 1, marginBottom: "0.6rem",
                }}>{s.value}</div>
                <div style={{
                  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: s.highlight ? "rgba(255,255,255,0.7)" : C.rust,
                  fontWeight: 700, marginBottom: "0.3rem",
                }}>{s.label}</div>
                <div style={{
                  fontSize: "0.8rem",
                  color: s.highlight ? "rgba(255,255,255,0.55)" : C.muted,
                }}>{s.note}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── MAIN 2-COL LAYOUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Quick Actions */}
            <div style={{ border: `1px solid ${C.border}`, background: "#fff", padding: "2rem 2rem 1.6rem" }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.rust, fontWeight: 700, marginBottom: "1.4rem",
              }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                {QUICK_ACTIONS.map((a) => (
                  <Link key={a.label} to={a.to} style={{ textDecoration: "none" }}>
                    <div style={{
                      border: `1px solid ${C.border}`, padding: "1.1rem 1.3rem",
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      color: C.darkGreen, fontSize: "0.92rem",
                      transition: "all 0.15s", background: C.cream, position: "relative",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.darkGreen; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.color = C.darkGreen; }}
                    >
                      <Icon d={a.icon} size={16} />
                      {a.label}
                      {a.label === "Open Messages" && unread > 0 && (
                        <span style={{
                          marginLeft: "auto",
                          background: C.rust, color: "#fff",
                          borderRadius: "50%", width: 22, height: 22,
                          fontSize: "0.68rem", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>{unread}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ border: `1px solid ${C.border}`, background: "#fff", padding: "2rem" }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.rust, fontWeight: 700, marginBottom: "1.4rem",
              }}>Recent Activity</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(activity.length ? activity : [{ id: 1, type: "message", text: "No recent activity yet.", time: "" }])
                  .map((item, i) => (
                  <div key={item.id} style={{
                    display: "flex", gap: "1rem", alignItems: "flex-start",
                    padding: "1rem 0",
                    borderBottom: i < (activity.length || 1) - 1 ? `1px solid ${C.border}` : "none",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: C.cream, border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: C.darkGreen, flexShrink: 0,
                    }}>
                      <Icon d={ACTIVITY_ICONS[item.type] ?? ACTIVITY_ICONS.message} size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.9rem", color: "#2c2c2c", lineHeight: 1.5 }}>{item.text}</div>
                      {item.time && <div style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.2rem" }}>{item.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages preview — NEW */}
            {recentMsgs.length > 0 && (
              <div style={{ border: `1px solid ${C.border}`, background: "#fff", padding: "2rem" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "1.4rem",
                }}>
                  <div style={{
                    fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.rust, fontWeight: 700,
                  }}>Recent Messages</div>
                  <Link to="/messages" style={{ fontSize: "0.8rem", color: C.darkGreen, textDecoration: "underline" }}>
                    View all →
                  </Link>
                </div>
                {recentMsgs.map((c, i) => (
                  <Link key={c.other_id} to={`/messages?to=${c.other_id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.85rem",
                      padding: "0.8rem 0",
                      borderBottom: i < recentMsgs.length - 1 ? `1px solid ${C.border}` : "none",
                    }}>
                      {/* Avatar circle */}
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: C.darkGreen, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: serif, fontSize: "0.95rem", flexShrink: 0,
                        position: "relative",
                      }}>
                        {c.other_name?.[0]}
                        {/* unread dot */}
                        {(c.unread_count > 0 || c.is_read === false) && (
                          <span style={{
                            position: "absolute", top: 0, right: 0,
                            width: 10, height: 10, borderRadius: "50%",
                            background: C.rust, border: "2px solid #fff",
                          }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "0.9rem", color: C.darkGreen,
                          fontWeight: (c.unread_count > 0 || c.is_read === false) ? 700 : 400,
                          marginBottom: "0.1rem",
                        }}>{c.other_name}</div>
                        <div style={{
                          fontSize: "0.78rem", color: C.muted,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          fontWeight: (c.unread_count > 0 || c.is_read === false) ? 600 : 400,
                        }}>{c.last_message}</div>
                      </div>
                      {(c.unread_count > 0) && (
                        <span style={{
                          background: C.rust, color: "#fff",
                          borderRadius: "50%", width: 20, height: 20,
                          fontSize: "0.65rem", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>{c.unread_count}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Profile card */}
            <div style={{ border: `1px solid ${C.border}`, background: "#fff", padding: "2rem", textAlign: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: C.darkGreen, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: serif, fontSize: "1.6rem", margin: "0 auto 1rem",
              }}>{firstName[0]}</div>
              <div style={{ fontFamily: serif, fontSize: "1.2rem", color: C.darkGreen, marginBottom: "0.25rem" }}>
                {user?.name ?? "Member"}
              </div>
              <div style={{
                fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                color: C.rust, marginBottom: "1.4rem",
              }}>{user?.role ?? "Member"}</div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.2rem" }}>
                <Link to="/profile" style={{ fontSize: "0.82rem", color: C.darkGreen, textDecoration: "underline" }}>
                  Edit your profile →
                </Link>
              </div>
            </div>

            {/* Unread callout — only when unread > 0 */}
            {unread > 0 && (
              <Link to="/messages" style={{ textDecoration: "none" }}>
                <div style={{
                  background: C.rust, padding: "1.4rem 1.6rem",
                  display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer",
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", flexShrink: 0,
                  }}>
                    <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: "1.1rem", color: "#fff", marginBottom: "0.1rem" }}>
                      {unread} unread {unread === 1 ? "message" : "messages"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
                      Tap to open your inbox →
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Tip banner */}
            <div style={{ background: C.darkGreen, padding: "1.8rem", color: "#fff" }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.rust, fontWeight: 700, marginBottom: "0.8rem",
              }}>Did you know?</div>
              <p style={{
                fontFamily: serif, fontSize: "1.05rem", lineHeight: 1.55,
                marginBottom: "1.2rem", color: "rgba(255,255,255,0.9)",
              }}>
                Alumni who complete their profile receive 3× more mentorship requests.
              </p>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <div style={{
                  background: C.rust, color: "#fff", padding: "0.7rem 1.2rem",
                  fontSize: "0.82rem", display: "inline-flex", alignItems: "center",
                  gap: 6, letterSpacing: "0.03em", cursor: "pointer",
                }}>
                  Complete Profile &nbsp;→
                </div>
              </Link>
            </div>

            {/* Network snapshot */}
            <div style={{ border: `1px solid ${C.border}`, background: "#fff", padding: "1.8rem" }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.rust, fontWeight: 700, marginBottom: "1.2rem",
              }}>Your Network</div>
              {[
                { label: "Connections", val: 12 },
                { label: "Mentors",     val: 2 },
                { label: "Mentees",     val: 1 },
              ].map(row => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.65rem 0", borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: "0.9rem", color: "#2c2c2c" }}>{row.label}</span>
                  <span style={{ fontFamily: serif, fontSize: "1.1rem", color: C.darkGreen }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}