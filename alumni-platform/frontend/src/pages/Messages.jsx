import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, BACKEND_URL, fmt } from "../lib/api";
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
  "https://www.belmont.edu/profiles/mary-claire-dismukes/_images/mary-claire-dismukes.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj5-CC8IqhXvWgD1OYsCfT4IChGKsrBA7xvw&s",
];

export default function Messages() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [convs, setConvs]       = useState([]);
  const [activeId, setActiveId] = useState(params.get("to") || null);
  const [other, setOther]       = useState(null);
  const [thread, setThread]     = useState([]);
  const [text, setText]         = useState("");
  const [error, setError]       = useState(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const wsRef    = useRef(null);
  const endRef   = useRef(null);
  const activeRef = useRef(activeId);
  useEffect(() => { activeRef.current = activeId; }, [activeId]);

  const loadConvs = async () => {
    try {
      const { data } = await api.get("/messages/conversations");
      setConvs(data);
      // Sum up all unread counts across conversations
      const total = data.reduce((acc, c) => acc + (c.unread_count || 0), 0);
      setTotalUnread(total);
    } catch {}
  };

  useEffect(() => { loadConvs(); }, []);

  // Mark conversation as read when opened
  const openConversation = async (otherId) => {
    setActiveId(otherId);
    // Optimistically clear unread for this conversation
    setConvs(prev => prev.map(c =>
      c.other_id === otherId ? { ...c, unread_count: 0 } : c
    ));
    // Tell backend to mark as read
    try { await api.post(`/messages/read/${otherId}`); } catch {}
    loadConvs();
  };

  useEffect(() => {
    if (!activeId) return;
    setError(null);
    setThread([]);
    (async () => {
      try {
        const [{ data: t }, { data: u }] = await Promise.all([
          api.get(`/messages/thread/${activeId}`),
          api.get(`/users/${activeId}`),
        ]);
        setThread(t);
        setOther(u);
      } catch (e) {
        const msg = e.response?.data?.detail || "Could not load messages.";
        setError(msg);
        try { const { data: u } = await api.get(`/users/${activeId}`); setOther(u); } catch {}
      }
    })();
  }, [activeId]);

  // WebSocket
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data } = await api.post("/auth/ws-token");
        const wsUrl = BACKEND_URL.replace(/^http/, "ws") + `/api/ws/${user.id}?token=${data.token}`;
        const ws = new WebSocket(wsUrl);
        ws.onmessage = (e) => {
          try {
            const p = JSON.parse(e.data);
            if (p.type === "message") {
              const m = p.data;
              const o = activeRef.current;
              if (m.senderId === o || m.receiverId === o) {
                setThread(prev => prev.some(x => x._id === m._id) ? prev : [...prev, m]);
              }
              loadConvs();
            }
          } catch {}
        };
        wsRef.current = ws;
      } catch {}
    })();
    return () => wsRef.current?.close();
  }, [user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    try {
      const { data } = await api.post("/messages", { receiver_id: activeId, content: text.trim() });
      setThread(prev => prev.some(x => x._id === data._id) ? prev : [...prev, data]);
      setText("");
      setError(null);
      loadConvs();
    } catch (err) {
      toast.error(fmt(err.response?.data?.detail));
    }
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: body }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2.5rem" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: "1.8rem" }}>
          <div style={{
            fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.rust, fontWeight: 700, marginBottom: "0.6rem",
            borderTop: `1px solid ${C.rust}`, paddingTop: "0.4rem", display: "inline-block",
          }}>Conversations</div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1 style={{
              fontFamily: serif, fontSize: "clamp(2rem, 3vw, 2.6rem)",
              color: C.darkGreen, fontWeight: 400, margin: 0,
            }}>Messages</h1>
            {/* Total unread badge next to heading */}
            {totalUnread > 0 && (
              <span style={{
                background: C.rust, color: "#fff",
                borderRadius: "50px", padding: "0.2rem 0.7rem",
                fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.03em",
              }}>
                {totalUnread} new
              </span>
            )}
          </div>
        </div>

        {/* ── CHAT LAYOUT ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "300px 1fr",
          height: 600,
          border: `1px solid ${C.border}`,
          background: "#fff",
          overflow: "hidden",
        }}>

          {/* ── SIDEBAR ── */}
          <div style={{
            borderRight: `1px solid ${C.border}`,
            overflowY: "auto",
            background: C.cream,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              padding: "0.9rem 1.2rem",
              fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.rust, fontWeight: 700,
              borderBottom: `1px solid ${C.border}`,
              background: "#fff",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>Conversations</span>
              {totalUnread > 0 && (
                <span style={{
                  background: C.rust, color: "#fff",
                  borderRadius: "50%", width: 20, height: 20,
                  fontSize: "0.65rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{totalUnread}</span>
              )}
            </div>

            {convs.length === 0 && (
              <div style={{ padding: "1.5rem 1.2rem", color: C.muted, fontSize: "0.88rem", lineHeight: 1.6 }}>
                No conversations yet.<br />
                <span style={{ fontSize: "0.8rem" }}>Accept a mentorship request to start messaging.</span>
              </div>
            )}

            {convs.map((c, i) => {
              const isActive   = activeId === c.other_id;
              const hasUnread  = (c.unread_count || 0) > 0;
              return (
                <button
                  key={c.other_id}
                  onClick={() => openConversation(c.other_id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.85rem",
                    width: "100%", textAlign: "left",
                    padding: "0.95rem 1.2rem",
                    borderBottom: `1px solid ${C.border}`,
                    background: isActive ? "#fff" : "transparent",
                    border: "none",
                    borderLeft: isActive ? `3px solid ${C.darkGreen}` : "3px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={PROFILE_PICS[i % PROFILE_PICS.length]}
                      alt={c.other_name}
                      style={{
                        width: 40, height: 40, borderRadius: "50%",
                        objectFit: "cover", border: `1px solid ${C.border}`,
                        display: "block",
                      }}
                      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                    {/* Fallback initial */}
                    <div style={{
                      display: "none", width: 40, height: 40, borderRadius: "50%",
                      background: C.darkGreen, color: "#fff",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: serif, fontSize: "1rem",
                    }}>{c.other_name?.[0]}</div>
                    {/* Green online dot */}
                    <span style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 10, height: 10, borderRadius: "50%",
                      background: "#22c55e", border: "2px solid #fff",
                    }} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: hasUnread ? 700 : 400,
                      color: C.darkGreen, fontSize: "0.9rem",
                      marginBottom: "0.15rem",
                      fontFamily: hasUnread ? body : body,
                    }}>{c.other_name}</div>
                    <div style={{
                      fontSize: "0.78rem", color: hasUnread ? "#2c2c2c" : C.muted,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      fontWeight: hasUnread ? 600 : 400,
                    }}>{c.last_message}</div>
                  </div>

                  {/* Unread count badge */}
                  {hasUnread && (
                    <span style={{
                      background: C.rust, color: "#fff",
                      borderRadius: "50%", width: 20, height: 20,
                      fontSize: "0.65rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>{c.unread_count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── CHAT PANEL ── */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
            {!activeId ? (
              /* Empty state */
              <div style={{
                margin: "auto", textAlign: "center", color: C.muted, padding: "2rem",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: C.cream, border: `2px dashed ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.2rem", color: C.darkGreen,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div style={{ fontFamily: serif, fontSize: "1.2rem", color: C.darkGreen, marginBottom: "0.4rem" }}>
                  Select a conversation
                </div>
                <p style={{ fontSize: "0.88rem", maxWidth: 260, margin: "0 auto" }}>
                  Or go to <a href="/mentorship" style={{ color: C.rust }}>Mentorship</a> to start one.
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{
                  padding: "1rem 1.4rem",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", gap: "0.9rem",
                  background: "#fff",
                }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={PROFILE_PICS[convs.findIndex(c => c.other_id === activeId) % PROFILE_PICS.length]}
                      alt={other?.name}
                      style={{
                        width: 42, height: 42, borderRadius: "50%",
                        objectFit: "cover", border: `1px solid ${C.border}`, display: "block",
                      }}
                      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                    <div style={{
                      display: "none", width: 42, height: 42, borderRadius: "50%",
                      background: C.darkGreen, color: "#fff",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: serif, fontSize: "1.1rem",
                    }}>{other?.name?.[0]}</div>
                    <span style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 10, height: 10, borderRadius: "50%",
                      background: "#22c55e", border: "2px solid #fff",
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: "1.05rem", color: C.darkGreen }}>
                      {other?.name || "…"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: C.muted }}>
                      {other?.role}{other?.industry ? ` · ${other.industry}` : ""}
                    </div>
                  </div>
                </div>

                {/* Error banner */}
                {error && (
                  <div style={{
                    padding: "0.75rem 1.4rem",
                    background: "#fef2f2", borderBottom: "1px solid #fecaca",
                    color: "#991b1b", fontSize: "0.85rem",
                  }}>⚠️ {error}</div>
                )}

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1.4rem 1.6rem" }}>
                  {thread.length === 0 && !error && (
                    <div style={{
                      textAlign: "center", color: C.muted,
                      marginTop: "3rem", fontSize: "0.9rem",
                      fontFamily: serif,
                    }}>
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {thread.map(m => {
                    const mine = m.senderId === user.id;
                    return (
                      <div key={m._id} style={{
                        display: "flex",
                        justifyContent: mine ? "flex-end" : "flex-start",
                        marginBottom: "1rem",
                      }}>
                        <div>
                          <div style={{
                            background: mine ? C.darkGreen : C.cream,
                            color: mine ? "#fff" : "#2c2c2c",
                            padding: "0.7rem 1rem",
                            borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            maxWidth: 420, fontSize: "0.92rem",
                            lineHeight: 1.55, whiteSpace: "pre-wrap",
                            border: mine ? "none" : `1px solid ${C.border}`,
                          }}>
                            {m.content}
                          </div>
                          <div style={{
                            fontSize: "0.7rem", color: C.muted,
                            marginTop: "0.25rem",
                            textAlign: mine ? "right" : "left",
                          }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                {!error && (
                  <form onSubmit={send} style={{
                    padding: "0.9rem 1.2rem",
                    borderTop: `1px solid ${C.border}`,
                    display: "flex", gap: "0.6rem",
                    background: "#fff",
                  }}>
                    <input
                      placeholder="Write a message…"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      style={{
                        flex: 1, border: `1px solid ${C.border}`,
                        padding: "0.7rem 1rem", fontSize: "0.9rem",
                        fontFamily: body, outline: "none",
                        background: C.cream, color: "#2c2c2c",
                        borderRadius: 0,
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!text.trim()}
                      style={{
                        background: text.trim() ? C.darkGreen : "#ccc",
                        color: "#fff", border: "none",
                        padding: "0.7rem 1.6rem", fontSize: "0.88rem",
                        fontFamily: body, cursor: text.trim() ? "pointer" : "default",
                        letterSpacing: "0.03em", transition: "background 0.15s",
                      }}
                    >
                      Send
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}