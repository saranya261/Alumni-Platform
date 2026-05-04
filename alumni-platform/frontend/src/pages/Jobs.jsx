import React, { useEffect, useState } from "react";
import { api, fmt } from "../lib/api";
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

const INIT = { title: "", description: "", company: "", location: "", job_type: "Full-time", link: "" };

const TYPE_COLORS = {
  "Full-time":  { bg: "#e8f0ec", color: "#0a3026" },
  "Internship": { bg: "#fdf3e7", color: "#b45309" },
  "Part-time":  { bg: "#fdecea", color: "#991b1b" },
  "Contract":   { bg: "#ede9fe", color: "#5b21b6" },
};

const DEMO_JOBS = [
  {
    _id: "demo-1",
    title: "ML Engineer Intern",
    company: "Nova AI Labs",
    location: "Remote",
    job_type: "Internship",
    description: "Work on recommendation systems.",
    postedByName: "Dr. Elena Ruiz",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-2",
    title: "Junior Analyst",
    company: "Keystone Capital",
    location: "New York, NY",
    job_type: "Full-time",
    description: "Quantitative research graduate program.",
    postedByName: "Dr. Elena Ruiz",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-3",
    title: "Product Design Intern",
    company: "Mosaic Studio",
    location: "San Francisco, CA",
    job_type: "Internship",
    description: "Flagship consumer product.",
    postedByName: "Dr. Elena Ruiz",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-4",
    title: "Software Engineer II",
    company: "Veridian Health",
    location: "Boston, MA",
    job_type: "Full-time",
    description: "Build scalable backend services for a digital health platform serving millions of patients.",
    postedByName: "Prof. Sara Kim",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-5",
    title: "Data Analyst",
    company: "Brightfield Consulting",
    location: "Chicago, IL",
    job_type: "Contract",
    description: "6-month engagement focused on workforce analytics and executive reporting dashboards.",
    postedByName: "Ms. Priya Nair",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-6",
    title: "Policy Research Intern",
    company: "Urban Future Institute",
    location: "Washington, DC",
    job_type: "Internship",
    description: "Assist senior researchers on housing and climate policy briefs for federal agencies.",
    postedByName: "Dr. Maya Torres",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-7",
    title: "Content Strategist",
    company: "Lumen Media",
    location: "Remote",
    job_type: "Part-time",
    description: "Shape editorial direction and content calendar for a growing B2B publication.",
    postedByName: "Ms. Clara West",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-8",
    title: "Growth Marketing Manager",
    company: "Oaks Ventures",
    location: "Austin, TX",
    job_type: "Full-time",
    description: "Lead acquisition strategy and performance marketing for a Series B consumer startup.",
    postedByName: "Dr. Elena Ruiz",
    postedBy: "demo",
    link: "",
  },
  {
    _id: "demo-9",
    title: "UX Researcher",
    company: "Axiom Labs",
    location: "Seattle, WA",
    job_type: "Contract",
    description: "Conduct usability studies and synthesize insights for an enterprise SaaS product.",
    postedByName: "Prof. Leila Hassan",
    postedBy: "demo",
    link: "",
  },
];

function PostForm({ onClose, onSuccess }) {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async () => {
    if (!form.title || !form.company || !form.description)
      return toast.error("Title, company and description are required.");
    setLoading(true);
    try {
      await api.post("/opportunities", form);
      toast.success("Opportunity posted!");
      onSuccess();
      onClose();
    } catch (e) { toast.error(fmt(e.response?.data?.detail)); }
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
          background: C.cream, width: "100%", maxWidth: 560,
          padding: "2.5rem", position: "relative",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1.2rem",
            background: "none", border: "none", fontSize: "1.3rem",
            cursor: "pointer", color: C.muted,
          }}
        >&times;</button>

        <div style={{
          fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
          color: C.rust, fontWeight: 700, marginBottom: "0.6rem",
          borderTop: `1px solid ${C.rust}`, paddingTop: "0.4rem", display: "inline-block",
        }}>New Opportunity</div>
        <h2 style={{
          fontFamily: serif, fontSize: "1.8rem", color: C.darkGreen,
          fontWeight: 400, marginBottom: "1.8rem",
        }}>Post a role</h2>

        {[
          { key: "title", placeholder: "Job title" },
          { key: "company", placeholder: "Company name" },
          { key: "location", placeholder: "Location (or Remote)" },
          { key: "link", placeholder: "Application link (optional)" },
        ].map(({ key, placeholder }) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block", fontSize: "0.75rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.darkGreen, marginBottom: "0.4rem", fontWeight: 600,
            }}>{placeholder}</label>
            <input
              value={form[key]}
              onChange={f(key)}
              placeholder={placeholder}
              style={{
                width: "100%", border: `1px solid ${C.border}`,
                background: "#fff", padding: "0.75rem 1rem",
                fontSize: "0.95rem", fontFamily: body, color: "#2c2c2c",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{
            display: "block", fontSize: "0.75rem", letterSpacing: "0.1em",
            textTransform: "uppercase", color: C.darkGreen, marginBottom: "0.4rem", fontWeight: 600,
          }}>Job type</label>
          <select
            value={form.job_type}
            onChange={f("job_type")}
            style={{
              width: "100%", border: `1px solid ${C.border}`,
              background: "#fff", padding: "0.75rem 1rem",
              fontSize: "0.95rem", fontFamily: body, color: "#2c2c2c",
              outline: "none", boxSizing: "border-box",
            }}
          >
            {["Full-time", "Internship", "Part-time", "Contract"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1.6rem" }}>
          <label style={{
            display: "block", fontSize: "0.75rem", letterSpacing: "0.1em",
            textTransform: "uppercase", color: C.darkGreen, marginBottom: "0.4rem", fontWeight: 600,
          }}>Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={f("description")}
            placeholder="Describe the role, requirements, and what makes it a great opportunity..."
            style={{
              width: "100%", border: `1px solid ${C.border}`,
              background: "#fff", padding: "0.75rem 1rem",
              fontSize: "0.95rem", fontFamily: body, color: "#2c2c2c",
              outline: "none", resize: "vertical", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: C.darkGreen, color: "#fff", border: "none",
              padding: "0.85rem 2rem", fontSize: "0.95rem",
              fontFamily: body, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.03em", opacity: loading ? 0.7 : 1,
            }}
          >{loading ? "Publishing..." : "Publish"}</button>
          <button
            onClick={onClose}
            style={{
              background: "transparent", color: C.muted,
              border: `1px solid ${C.border}`,
              padding: "0.85rem 1.6rem", fontSize: "0.95rem",
              fontFamily: body, cursor: "pointer",
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, user, onDelete }) {
  const tc = TYPE_COLORS[job.job_type] || { bg: "#f3f4f6", color: "#374151" };
  const canDelete = user?.id === job.postedBy || user?.role === "admin";
  const isDemo = job._id?.startsWith("demo-");

  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.border}`,
      padding: "1.8rem", display: "flex", flexDirection: "column",
      transition: "border-color 0.18s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      {/* Type badge */}
      <div style={{ marginBottom: "1rem" }}>
        <span style={{
          background: tc.bg, color: tc.color,
          fontSize: "0.6rem", letterSpacing: "0.18em",
          textTransform: "uppercase", fontWeight: 700,
          padding: "0.3rem 0.75rem",
        }}>{job.job_type}</span>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: serif, fontSize: "1.35rem",
        color: C.darkGreen, fontWeight: 400,
        margin: "0 0 0.4rem",
      }}>{job.title}</h2>

      {/* Company & location */}
      <div style={{ color: C.muted, fontSize: "0.9rem", marginBottom: "0.9rem" }}>
        {job.company}{job.location ? ` · ${job.location}` : ""}
      </div>

      {/* Description */}
      <p style={{
        color: C.muted, fontSize: "0.88rem", lineHeight: 1.65,
        flex: 1, marginBottom: "1.4rem",
        display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{job.description}</p>

      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", borderTop: `1px solid ${C.border}`,
        paddingTop: "1rem", marginTop: "auto",
      }}>
        <div style={{ fontSize: "0.8rem", color: C.muted, fontStyle: "italic" }}>
          By {job.postedByName}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {job.link && (
            <a href={job.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                background: C.darkGreen, color: "#fff", border: "none",
                padding: "0.55rem 1.2rem", fontSize: "0.85rem",
                fontFamily: body, cursor: "pointer", letterSpacing: "0.03em",
              }}>Apply</button>
            </a>
          )}
          {!job.link && (
            <button style={{
              background: C.darkGreen, color: "#fff", border: "none",
              padding: "0.55rem 1.2rem", fontSize: "0.85rem",
              fontFamily: body, cursor: "pointer", letterSpacing: "0.03em",
            }}>Apply</button>
          )}
          {canDelete && !isDemo && (
            <button
              onClick={() => onDelete(job._id)}
              style={{
                background: "transparent", color: C.rust,
                border: `1px solid ${C.border}`,
                padding: "0.55rem 1rem", fontSize: "0.85rem",
                fontFamily: body, cursor: "pointer",
              }}
            >Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const { user } = useAuth();
  const [apiJobs, setApiJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const canPost = user?.role === "alumni" || user?.role === "admin";

  const load = async () => {
    try {
      const { data } = await api.get("/opportunities");
      setApiJobs(data);
    } catch (_) {}
  };

  useEffect(() => { load(); }, []);

  // Merge demo jobs with API jobs, avoiding duplicates by title+company
  const apiKeys = new Set(apiJobs.map(j => `${j.title}|${j.company}`));
  const filteredDemo = DEMO_JOBS.filter(d => !apiKeys.has(`${d.title}|${d.company}`));
  const jobs = [...apiJobs, ...filteredDemo];

  const remove = async (id) => {
    try { await api.delete(`/opportunities/${id}`); toast.success("Removed."); load(); }
    catch (e) { toast.error(fmt(e.response?.data?.detail)); }
  };

  const types = ["All", "Full-time", "Internship", "Part-time", "Contract"];
  const filtered = filter === "All" ? jobs : jobs.filter(j => j.job_type === filter);

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: body }}>
      {showForm && <PostForm onClose={() => setShowForm(false)} onSuccess={load} />}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem 2.5rem" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
          <div>
            <div style={{
              fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
              color: C.rust, fontWeight: 700, marginBottom: "0.7rem",
              borderTop: `1px solid ${C.rust}`, paddingTop: "0.4rem", display: "inline-block",
            }}>Opportunities</div>
            <h1 style={{
              fontFamily: serif, fontSize: "clamp(2rem, 3.5vw, 3rem)",
              color: C.darkGreen, fontWeight: 400, margin: 0,
            }}>Roles shared by the community.</h1>
            <p style={{ color: C.muted, marginTop: "0.5rem", fontSize: "0.95rem" }}>
              {jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"} posted by alumni
            </p>
          </div>
          {canPost && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: C.darkGreen, color: "#fff", border: "none",
                padding: "0.85rem 2rem", fontSize: "0.9rem",
                fontFamily: body, cursor: "pointer", letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >Post Opportunity</button>
          )}
        </div>

        {/* FILTER TABS */}
        <div style={{
          display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`,
          marginBottom: "2rem",
        }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.7rem 1.2rem", fontFamily: body, fontSize: "0.9rem",
                color: filter === t ? C.darkGreen : C.muted,
                borderBottom: filter === t ? `2px solid ${C.darkGreen}` : "2px solid transparent",
                marginBottom: "-1px", letterSpacing: "0.02em",
              }}
            >{t}</button>
          ))}
        </div>

        {/* JOBS GRID */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            border: `1px solid ${C.border}`, background: "#fff",
            color: C.muted, fontFamily: serif, fontSize: "1.2rem",
          }}>
            {filter === "All" ? "No opportunities posted yet." : `No ${filter} roles posted yet.`}
            {canPost && (
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    background: C.darkGreen, color: "#fff", border: "none",
                    padding: "0.75rem 1.8rem", fontSize: "0.9rem",
                    fontFamily: body, cursor: "pointer",
                  }}
                >Post the first one</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}>
            {filtered.map(j => (
              <JobCard key={j._id} job={j} user={user} onDelete={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}