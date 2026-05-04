import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/directory", label: "Directory" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/jobs", label: "Opportunities" },
  { to: "/messages", label: "Messages" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/" && !user;
  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <header style={{
      background: isLanding ? "rgba(253,251,247,0.92)" : "rgba(253,251,247,0.97)",
      borderBottom: isLanding ? "1px solid rgba(232,229,223,0.5)" : "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Link to={user ? "/dashboard" : "/"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "var(--ivy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cormorant Garamond", fontSize: 20 }}>A</div>
          <div>
            <div className="font-serif" style={{ fontSize: 20, color: "var(--ivy)" }}>Alumnae</div>
            <div className="overline">College Network</div>
          </div>
        </Link>

        {user && (
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV.map(n => (
              <Link key={n.to} to={n.to} style={{
                padding: "8px 16px",
                textDecoration: "none",
                color: location.pathname === n.to ? "var(--ivy)" : "var(--muted)",
                fontSize: 14,
                fontWeight: location.pathname === n.to ? 600 : 400,
                borderBottom: location.pathname === n.to ? "2px solid var(--ivy)" : "2px solid transparent",
              }}>{n.label}</Link>
            ))}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!user ? (
            <>
              <Link to="/login" style={{ color: "var(--ivy)", textDecoration: "none", fontSize: 14 }}>Sign In</Link>
              <Link to="/register">
                <button className="btn-primary">Join Network</button>
              </Link>
            </>
          ) : (
            <>
  <Link to="/profile" style={{ color: "var(--ivy)", textDecoration: "none", fontSize: 14 }}>{user.name}</Link>
  {user.role === "admin" && (
    <Link to="/admin" style={{ color: "#fff", background: "var(--ivy)", textDecoration: "none", fontSize: 13, padding: "6px 14px", borderRadius: "6px" }}>Admin Panel</Link>
  )}
  <button className="btn-outline" onClick={handleLogout}>Sign Out</button>
</>
          )}
        </div>
      </div>
    </header>
  );
}