import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fmt } from "../lib/api";
import { toast } from "sonner";

export default function Profile() {
  const { id } = useParams();
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const isMe = !id || id === user?.id;

  useEffect(() => {
    (async () => {
      const uid = id || user.id;
      const { data } = await api.get(`/users/${uid}`);
      setTarget(data);
      setForm({ ...data, skills: (data.skills || []).join(", ") });
    })();
  }, [id, user]);
  if (!target) return <div style={{ padding: 48 }}>Loading…</div>;

  const save = async () => {
    try {
      const payload = { ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean), graduation_year: form.graduation_year ? Number(form.graduation_year) : null };
      const { data } = await api.put("/users/me", payload);
      setTarget(data); await refreshMe(); setEditing(false); toast.success("Updated.");
    } catch (e) { toast.error(fmt(e.response?.data?.detail)); }
  };
  const reqMentor = async () => {
    try { await api.post("/mentorship", { alumni_id: target.id, message: msg }); toast.success("Request sent."); setMsg(""); }
    catch (e) { toast.error(fmt(e.response?.data?.detail)); }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
      <div className="card-editorial" style={{ padding: 32 }}>
        <div className="overline">{target.role} {target.graduation_year && `· Class of ${target.graduation_year}`}</div>
        <h1 className="font-serif" style={{ fontSize: "2.5rem", color: "var(--ivy)", margin: "8px 0 16px" }}>{target.name}</h1>
        <div style={{ color: "var(--muted)", marginBottom: 16 }}>{target.industry}</div>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{target.bio}</p>
        {target.experience && <><div className="overline" style={{ marginTop: 24 }}>Experience</div><p style={{ color: "var(--muted)" }}>{target.experience}</p></>}
        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(target.skills || []).map(s => <span key={s} className="tag">{s}</span>)}
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {isMe ? (
            <button className="btn-primary" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit Profile"}</button>
          ) : (
            <>
              <button className="btn-outline" onClick={() => navigate(`/messages?to=${target.id}`)}>Message</button>
              {target.role === "alumni" && user?.role === "student" && (
                <div style={{ width: "100%", marginTop: 16 }}>
                  <textarea className="input" rows={4} placeholder="Why would you like to connect?" value={msg} onChange={e => setMsg(e.target.value)} />
                  <button className="btn-accent" style={{ marginTop: 12 }} onClick={reqMentor} disabled={!msg.trim()}>Request Mentorship</button>
                </div>
              )}
            </>
          )}
        </div>
        {editing && isMe && (
          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <input className="input" placeholder="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
            <textarea className="input" rows={3} placeholder="Bio" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <input className="input" placeholder="Industry" value={form.industry || ""} onChange={e => setForm({ ...form, industry: e.target.value })} />
            <input className="input" placeholder="Skills (comma-separated)" value={form.skills || ""} onChange={e => setForm({ ...form, skills: e.target.value })} />
            <textarea className="input" rows={3} placeholder="Experience" value={form.experience || ""} onChange={e => setForm({ ...form, experience: e.target.value })} />
            <button className="btn-primary" onClick={save}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}
