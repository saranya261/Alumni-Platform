import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fmt } from "../lib/api";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", industry: "", graduation_year: "" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, graduation_year: form.graduation_year ? Number(form.graduation_year) : null });
      toast.success("Welcome to the network.");
      navigate("/dashboard");
    } catch (err) { toast.error(fmt(err.response?.data?.detail) || err.message); }
  };
  return (
    <div style={{ maxWidth: 640, margin: "3rem auto", padding: "0 2rem" }}>
      <div className="overline">Create Account</div>
      <h1 className="font-serif" style={{ fontSize: "2.5rem", color: "var(--ivy)", margin: "8px 0 2rem" }}>Join the Alumnae Network.</h1>
      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {["student", "alumni"].map(r => (
            <label key={r} className="card-editorial" style={{ padding: 20, cursor: "pointer", borderWidth: form.role === r ? 2 : 1, borderColor: form.role === r ? "var(--ivy)" : "var(--border)" }}>
              <input type="radio" name="role" value={r} checked={form.role === r} onChange={upd("role")} />
              <div className="font-serif" style={{ fontSize: 18, color: "var(--ivy)", marginTop: 4 }}>{r === "student" ? "Student" : "Alumnus / Alumna"}</div>
            </label>
          ))}
        </div>
        <label>Full Name</label>
        <input className="input" style={{ marginBottom: 12 }} required value={form.name} onChange={upd("name")} />
        <label>Email</label>
        <input className="input" style={{ marginBottom: 12 }} type="email" required value={form.email} onChange={upd("email")} />
        <label>Password</label>
        <input className="input" style={{ marginBottom: 12 }} type="password" required minLength={6} value={form.password} onChange={upd("password")} />
        <label>Graduation Year</label>
        <input className="input" style={{ marginBottom: 12 }} type="number" value={form.graduation_year} onChange={upd("graduation_year")} />
        <label>Industry</label>
        <input className="input" style={{ marginBottom: 24 }} value={form.industry} onChange={upd("industry")} />
        <button className="btn-primary" type="submit">Create Account</button>
      </form>
      <p style={{ marginTop: 20, fontSize: 14 }}>Already a member? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
