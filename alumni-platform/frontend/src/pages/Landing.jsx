import React from "react";
import { Link } from "react-router-dom";

const HERO_IMG =
  "https://static.wixstatic.com/media/5473a8_24998360f4e04f3a990db6f116e3190b~mv2.jpg/v1/fill/w_1400,h_900,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5473a8_24998360f4e04f3a990db6f116e3190b~mv2.jpg";

// ── CTA section image — swap for your own photo if you like
const CTA_IMG =  "https://www.emexmag.com/wp-content/uploads/2022/07/Structured-Workplace-Learning-1.jpeg";


/* ─────────────────────────────────────────
   Tiny icon components (stroke-based SVG)
───────────────────────────────────────── */
const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36 }}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36 }}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

/* ─────────────────────────────────────────
   Feature cards data
───────────────────────────────────────── */
const CARDS = [
  {
    icon: <IconCompass />,
    title: "Mentorship That Matters",
    desc: "Request guidance from alumni whose journey mirrors the future you are building.",
  },
  {
    icon: <IconBriefcase />,
    title: "Career Opportunities",
    desc: "Roles shared directly by alumni — internships, graduate programs and hires that do not appear on job boards.",
  },
  {
    icon: <IconUsers />,
    title: "A Living Directory",
    desc: "Search across years, industries, and expertise. Reconnect with the community that shaped you.",
  },
  {
    icon: <IconMessage />,
    title: "Conversations, In Real Time",
    desc: "Message classmates, mentors and mentees with end-to-end presence and instant delivery.",
  },
];

/* ─────────────────────────────────────────
   Shared style tokens
───────────────────────────────────────── */
const C = {
  cream: "#f5f2ec",
  darkGreen: "#0a3026",
  rust: "#c25942",
  muted: "#666",
};

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", background: C.cream, color: "#2c2c2c" }}>

      {/* ── HERO ─────────────────────────────── */}
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginTop: "-68px", // pulls up behind sticky navbar
        }}
      >
        {/* dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,48,38,0.72)" }} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "12rem 3rem 7rem",
            width: "100%",
          }}
        >
          <div style={styles.eyebrow}>
            The College Alumnae Network — Est. 2026
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
              color: "#fff",
              lineHeight: 1.1,
              maxWidth: 780,
              marginBottom: "1.6rem",
              fontWeight: 600,
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            Where the people who built you help you build what's next.
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              maxWidth: 500,
              margin: "0 0 2.8rem",
              lineHeight: 1.75,
              fontSize: "1.05rem",
            }}
          >
            A private, intentional space for students and alumni to find one
            another — for mentorship, for opportunity, for conversation that
            actually leads somewhere.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button style={styles.btnPrimary}>Request Your Invitation &nbsp;→</button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={styles.btnGhost}>Sign In</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FEATURES SECTION ─────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 3rem" }}>
        {/* Section header — two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.rust,
                fontWeight: 700,
                marginBottom: "0.8rem",
                borderTop: `1px solid ${C.rust}`,
                paddingTop: "0.5rem",
                display: "inline-block",
              }}
            >
              What you can do here
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: C.darkGreen,
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              A network designed with intention.
            </h2>
          </div>
          <p style={{ color: C.muted, lineHeight: 1.8, fontSize: "1rem", paddingTop: "1.5rem" }}>
            Most professional networks optimize for vanity. This one optimizes
            for signal. Every feature is built around the question, "Will this
            actually help someone?"
          </p>
        </div>

        {/* 2×2 cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                background: C.cream,
                padding: "2.8rem 2.5rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.cream)}
            >
              <div style={{ color: C.darkGreen, marginBottom: "1.8rem" }}>{card.icon}</div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  color: C.darkGreen,
                  marginBottom: "0.85rem",
                  fontWeight: 400,
                }}
              >
                {card.title}
              </div>
              <p style={{ color: C.muted, lineHeight: 1.75, fontSize: "0.95rem" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ───────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 3rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 340,
            overflow: "hidden",
          }}
        >
          {/* Left — dark text panel */}
          <div
            style={{
              background: C.darkGreen,
              padding: "4rem 3.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.rust,
                fontWeight: 700,
                marginBottom: "1.2rem",
              }}
            >
              Ready when you are
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                color: "#fff",
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: "1.2rem",
              }}
            >
              Join the conversation.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.75,
                fontSize: "0.95rem",
                marginBottom: "2rem",
              }}
            >
              Create an account as a student or alumnus. Your first mentorship
              request could be five minutes away.
            </p>
            <Link to="/register" style={{ textDecoration: "none", alignSelf: "flex-start" }}>
              <button style={styles.btnPrimary}>Create Your Profile &nbsp;→</button>
            </Link>
          </div>

          {/* Right — full-bleed photo */}
          <div style={{ overflow: "hidden", position: "relative" }}>
            <img
              src={CTA_IMG}
              alt="Students collaborating"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared button styles ── */
const styles = {
  eyebrow: {
    fontSize: "0.68rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#c25942",
    fontWeight: 700,
    marginBottom: 24,
  },
  btnPrimary: {
    background: "#c25942",
    color: "#fff",
    border: "none",
    padding: "0.85rem 2rem",
    fontSize: "0.95rem",
    cursor: "pointer",
    letterSpacing: "0.01em",
    fontFamily: "'EB Garamond', Georgia, serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnGhost: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.65)",
    color: "#fff",
    padding: "0.85rem 2rem",
    fontSize: "0.95rem",
    cursor: "pointer",
    letterSpacing: "0.01em",
    fontFamily: "'EB Garamond', Georgia, serif",
  },
};