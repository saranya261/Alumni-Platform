import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, fmt } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function Mentorship() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [tab, setTab] = useState(user?.role === "alumni" ? "in" : "out");

  const load = async () => {
    const { data } = await api.get("/mentorship/my");
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const act = async (id, status) => {
    try {
      await api.patch(`/mentorship/${id}`, { status });
      toast.success(status === "accepted" ? "Request accepted! You can now message each other." : "Request declined.");
      load();
    } catch (e) { toast.error(fmt(e.response?.data?.detail)); }
  };

  const incoming = list.filter(r => r.alumniId === user?.id);
  const outgoing = list.filter(r => r.studentId === user?.id);
  const rows = tab === "in" ? incoming : outgoing;

  const statusColor = (s) => s === "accepted" ? "#166534" : s === "rejected" ? "#991b1b" : "#92400e";
  const statusBg    = (s) => s === "accepted" ? "#dcfce7"  : s === "rejected" ? "#fee2e2"  : "#fef3c7";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
      <div className="overline">Mentorship</div>
      <h1 className="font-serif" style={{ fontSize: "2.5rem", color: "var(--ivy)", margin: "8px 0 2rem" }}>
        Requests & Responses
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid var(--border)", marginBottom: 24 }}>
        {[
          { key: "in",  label: `Incoming (${incoming.length})` },
          { key: "out", label: `Outgoing (${outgoing.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 24px", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? "var(--ivy)" : "var(--muted)",
            borderBottom: tab === t.key ? "2px solid var(--ivy)" : "2px solid transparent",
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
          <p>{tab === "in" ? "No incoming requests yet." : "You haven't sent any requests yet."}</p>
          {tab === "out" && user?.role === "student" && (
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Go to the{" "}
              <a href="/directory" style={{ color: "var(--accent)" }}>Directory</a>
              {" "}to find alumni and request mentorship.
            </p>
          )}
        </div>
      )}

      {/* Request cards */}
      {rows.map(r => {
        // figure out the other person's ID for messaging
        const otherId = tab === "in" ? r.studentId : r.alumniId;

        return (
          <div key={r._id} className="card-editorial" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="overline" style={{ marginBottom: 6 }}>
                  {tab === "in" ? `From ${r.studentName}` : `To ${r.alumniName}`}
                </div>
                <p style={{ color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.6 }}>{r.message}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "3px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
                    background: statusBg(r.status), color: statusColor(r.status),
                    textTransform: "capitalize",
                  }}>{r.status}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
                {/* Accept / Decline for alumni on pending */}
                {tab === "in" && r.status === "pending" && (
                  <>
                    <button className="btn-primary" onClick={() => act(r._id, "accepted")}>Accept</button>
                    <button className="btn-outline" onClick={() => act(r._id, "rejected")}>Decline</button>
                  </>
                )}

                {/* ✅ Message button appears for BOTH parties once accepted */}
                {r.status === "accepted" && (
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/messages?to=${otherId}`)}
                    style={{ background: "var(--accent)", border: "none" }}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}