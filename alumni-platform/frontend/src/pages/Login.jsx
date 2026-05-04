import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fmt } from "../lib/api";
import { toast } from "sonner";

const BUILDING_IMG =
  "https://images.pexels.com/photos/17792667/pexels-photo-17792667.jpeg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(fmt(err.response?.data?.detail) || err.message);
    }
  };

  return (
    <div style={{
      height: "calc(100vh - 68px)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      overflow: "hidden",
    }}>

      {/* ── LEFT: image with text overlay ── */}
      <div style={{ position: "relative", overflow: "hidden", height: "100%" }}>
        {/* Photo */}
        <img
          src={BUILDING_IMG}
          alt="College building"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />

        {/* Dark gradient overlay — stronger at bottom so text pops */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,48,38,0.45) 0%, rgba(10,48,38,0.72) 100%)",
        }} />

        {/* Text — pinned to bottom-left like the screenshot */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2.5rem 2.8rem",
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#c25942",
            fontWeight: 700,
            marginBottom: "0.9rem",
            fontFamily: "'EB Garamond', Georgia, serif",
          }}>
            Welcome Back
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
            color: "#ffffff",
            fontWeight: 400,
            lineHeight: 1.25,
            margin: 0,
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}>
            The conversations you started are still here.
          </h2>
        </div>
      </div>

      {/* ── RIGHT: form panel vertically centered ── */}
      <div style={{
        background: "#f5f2ec",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem 4rem",
        overflowY: "auto",
      }}>

        <div style={{
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#c25942",
          fontWeight: 700,
          marginBottom: "1rem",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}>
          Sign In
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 2.8vw, 2.8rem)",
          color: "#0a3026",
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: "0.5rem",
        }}>
          Return to the network.
        </h1>

        <p style={{
          color: "#666",
          fontSize: "0.95rem",
          marginBottom: "2rem",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}>
          Use your alumnae credentials.
        </p>

        <label style={styles.label}>Email</label>
        <input
          type="email"
          required
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...styles.input, marginBottom: "1.6rem" }}
        />

        <button
          onClick={submit}
          style={{
            width: "100%",
            background: "#0a3026",
            color: "#fff",
            border: "none",
            padding: "1rem",
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "'EB Garamond', Georgia, serif",
            letterSpacing: "0.04em",
          }}
        >
          Sign In
        </button>

        <p style={{
          marginTop: "1.4rem",
          fontSize: "0.9rem",
          color: "#555",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}>
          New to the network?{" "}
          <Link to="/register" style={{ color: "#0a3026", textDecoration: "underline" }}>
            Request an account
          </Link>
        </p>

        <div style={{
          marginTop: "2rem",
          padding: "1rem 1.2rem",
          background: "#eae7e0",
          border: "1px solid rgba(0,0,0,0.1)",
          fontSize: "0.8rem",
          color: "#555",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}>
          <div style={{
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c25942",
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}>Demo</div>
          <div>student1@alumni.edu / student123</div>
          <div>alumni1@alumni.edu / alumni123</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: "0.88rem",
    color: "#2c2c2c",
    marginBottom: "0.4rem",
    fontFamily: "'EB Garamond', Georgia, serif",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    marginBottom: "1.2rem",
    fontFamily: "'EB Garamond', Georgia, serif",
    color: "#2c2c2c",
    outline: "none",
    boxSizing: "border-box",
  },
};