import React, { useState } from "react";
import { signIn, signUp } from "./auth";
import Chat from "./Chat";

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #EBF4DD;
      --primary: #90AB8B;
      --secondary: #5A7863;
      --dark: #3B4953;
      --bg-glass: rgba(235, 244, 221, 0.72);
      --shadow-soft: 0 8px 32px rgba(90, 120, 99, 0.12);
      --shadow-card: 0 20px 60px rgba(59, 73, 83, 0.10);
      --radius: 18px;
      --font-display: 'DM Serif Display', serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--dark);
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::selection { background: rgba(144, 171, 139, 0.3); }

    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-15px, 15px) scale(0.97); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-25px, 30px) scale(1.08); }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0); }
      40% { transform: translate(20px, -35px); }
      80% { transform: translate(-10px, 10px); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.15); opacity: 0.65; }
    }

    .anim-fade-up { animation: fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .anim-fade    { animation: fadeIn 0.5s ease both; }
    .anim-scale   { animation: scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

    .s-input {
      width: 100%;
      padding: 14px 18px;
      border: 1.5px solid rgba(144, 171, 139, 0.35);
      border-radius: 14px;
      background: rgba(255,255,255,0.55);
      font-family: var(--font-body);
      font-size: 15px;
      color: var(--dark);
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
      backdrop-filter: blur(8px);
    }
    .s-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(144, 171, 139, 0.18);
      background: rgba(255,255,255,0.8);
    }
    .s-input::placeholder { color: rgba(59,73,83,0.4); }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      box-shadow: 0 4px 20px rgba(90, 120, 99, 0.35);
      letter-spacing: 0.01em;
      position: relative;
      overflow: hidden;
    }
    .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(90, 120, 99, 0.42); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .btn-ghost {
      background: transparent;
      border: 1.5px solid rgba(144,171,139,0.45);
      color: var(--secondary);
      padding: 11px 24px;
      border-radius: 50px;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { background: rgba(144,171,139,0.12); border-color: var(--primary); }

    .glass-card {
      background: rgba(255,255,255,0.52);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.7);
      border-radius: var(--radius);
      box-shadow: var(--shadow-card);
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(144,171,139,0.4); border-radius: 3px; }

    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 48px;
      background: rgba(235,244,221,0.7);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(144,171,139,0.15);
    }
    @media (max-width: 600px) { .nav { padding: 16px 22px; } }

    .emotion-badge {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 500;
      backdrop-filter: blur(8px);
    }

    .chat-textarea {
      width: 100%;
      min-height: 130px;
      padding: 20px 22px;
      border: 1.5px solid rgba(144,171,139,0.3);
      border-radius: 18px;
      background: rgba(255,255,255,0.6);
      font-family: var(--font-body);
      font-size: 16px;
      color: var(--dark);
      outline: none;
      resize: none;
      transition: border-color 0.25s, box-shadow 0.25s;
      backdrop-filter: blur(10px);
      line-height: 1.6;
    }
    .chat-textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(144,171,139,0.15);
      background: rgba(255,255,255,0.8);
    }
    .chat-textarea::placeholder { color: rgba(59,73,83,0.38); font-style: italic; }

    .loader-dot {
      width: 7px; height: 7px;
      background: var(--primary);
      border-radius: 50%;
      animation: pulse 1.2s ease-in-out infinite;
    }
    .loader-dot:nth-child(2) { animation-delay: 0.2s; }
    .loader-dot:nth-child(3) { animation-delay: 0.4s; }

    .response-card { animation: scaleIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

    @media (max-width: 480px) {
      .nav { padding: 14px 18px; }
      .hero-title { font-size: clamp(36px, 10vw, 56px) !important; }
    }
  `}</style>
);

// ─── Background Orbs ──────────────────────────────────────────────────────────
const BackgroundOrbs = ({ variant = "default" }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{
      position: "absolute", width: 520, height: 520, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(144,171,139,0.28) 0%, transparent 70%)",
      top: "-140px", left: "-120px", animation: "float1 14s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", width: 380, height: 380, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(90,120,99,0.18) 0%, transparent 70%)",
      bottom: "60px", right: "-80px", animation: "float2 18s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", width: 260, height: 260, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(235,244,221,0.6) 0%, rgba(144,171,139,0.15) 60%, transparent 100%)",
      top: "45%", left: "55%", animation: "float3 22s ease-in-out infinite",
    }} />
    {variant === "auth" && (
      <div style={{
        position: "absolute", width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(144,171,139,0.22) 0%, transparent 70%)",
        bottom: "20%", left: "15%", animation: "breathe 8s ease-in-out infinite",
      }} />
    )}
  </div>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = ({ size = "md" }) => {
  const fs = size === "lg" ? 28 : 20;
  const iconSize = size === "lg" ? 36 : 28;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, userSelect: "none" }}>
      <div style={{
        width: iconSize, height: iconSize, borderRadius: "50%",
        background: "linear-gradient(135deg, #90AB8B 0%, #5A7863 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 10px rgba(90,120,99,0.3)", flexShrink: 0,
      }}>
        <svg width={iconSize * 0.5} height={iconSize * 0.5} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <circle cx="12" cy="12" r="3.5" fill="white" opacity="0.9" />
        </svg>
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontSize: fs, color: "var(--secondary)", letterSpacing: "-0.01em" }}>
        Serelyn
      </span>
    </div>
  );
};

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = ({ onNavigate }) => {
  const features = [
    { icon: "◎", title: "Emotion Detection", desc: "Understands what you're feeling, not just what you say." },
    { icon: "◯", title: "Always Present", desc: "No appointments. No waiting. Just open and talk." },
    { icon: "✦", title: "Private & Safe", desc: "Your thoughts stay yours. Always encrypted, always secure." },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <BackgroundOrbs />

      {/* ── Nav ── */}
      <nav className="nav">
        <Logo />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-ghost" style={{ fontSize: 14 }} onClick={() => onNavigate("auth")}>Sign In</button>
          <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => onNavigate("auth")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px 24px 60px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          position: "absolute", width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(144,171,139,0.22) 0%, transparent 65%)",
          animation: "breathe 7s ease-in-out infinite", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680 }}>
          <div className="anim-fade-up" style={{ animationDelay: "0.1s" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px",
              background: "rgba(144,171,139,0.18)",
              border: "1px solid rgba(144,171,139,0.3)",
              borderRadius: 50, fontSize: 13, color: "var(--secondary)",
              fontWeight: 500, letterSpacing: "0.04em", marginBottom: 32,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block", animation: "pulse 2s infinite" }} />
              AI Emotional Companion
            </span>
          </div>

          <h1 className="hero-title anim-fade-up" style={{
            animationDelay: "0.2s",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 7vw, 80px)",
            color: "var(--dark)", lineHeight: 1.08,
            letterSpacing: "-0.02em", marginBottom: 28,
          }}>
            A safe space to talk.
            <br />
            <span style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontStyle: "italic",
            }}>Anytime.</span>
          </h1>

          <p className="anim-fade-up" style={{
            animationDelay: "0.35s",
            fontSize: 18, lineHeight: 1.7,
            color: "rgba(59,73,83,0.7)",
            maxWidth: 480, margin: "0 auto 44px", fontWeight: 300,
          }}>
            Serelyn listens without judgment, understands your emotions, and responds with care — whenever you need it most.
          </p>

          <div className="anim-fade-up" style={{ animationDelay: "0.5s", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "15px 36px" }} onClick={() => onNavigate("auth")}>
              Start Talking →
            </button>
            <button className="btn-ghost" style={{ fontSize: 15, padding: "13px 28px" }}>
              How it works
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 36, animation: "float2 3s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(90,120,99,0.4))", margin: "0 auto" }} />
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, letterSpacing: "0.1em", color: "var(--primary)", fontWeight: 500, marginBottom: 48, textTransform: "uppercase" }}>
            What Serelyn offers
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: "36px 30px", transition: "transform 0.3s, box-shadow 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 28px 70px rgba(59,73,83,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(144,171,139,0.25) 0%, rgba(90,120,99,0.15) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: "var(--secondary)", marginBottom: 20,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--dark)", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(59,73,83,0.6)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(144,171,139,0.2) 0%, rgba(90,120,99,0.15) 100%)",
          border: "1px solid rgba(144,171,139,0.3)",
          borderRadius: 24, padding: "56px 48px",
          textAlign: "center", backdropFilter: "blur(12px)",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--dark)", marginBottom: 16, lineHeight: 1.2 }}>
            You deserve to be heard.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(59,73,83,0.65)", marginBottom: 32, lineHeight: 1.7, fontWeight: 300 }}>
            Thousands of people start their healing journey with Serelyn every day.
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: "15px 40px" }} onClick={() => onNavigate("auth")}>
            Begin Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

// ─── Auth Page ────────────────────────────────────────────────────────────────
// Supabase signIn / signUp are imported from ./auth.js
// On success, user ID is stored in localStorage("user_id")
// ─────────────────────────────────────────────────────────────────────────────
const AuthPage = ({ onNavigate, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);

  // ── Main submit handler ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "register") {
        // ── Supabase Sign Up ────────────────────────────────────────────────
        const { data, error: signUpError } = await signUp(form.email, form.password);
        if (signUpError) throw new Error(signUpError.message);

        const userId = data?.user?.id;
        if (userId) {
          localStorage.setItem("user_id", userId);
          console.log("Registered user:", userId);
        }

        setSuccess("Account created! Signing you in…");
        await new Promise(r => setTimeout(r, 800));

        // Use display name if provided, otherwise derive from email
        onLogin(form.name.trim() || form.email.split("@")[0]);

      } else {
        // ── Supabase Sign In ────────────────────────────────────────────────
        const { data, error: signInError } = await signIn(form.email, form.password);
        if (signInError) throw new Error(signInError.message);

        const userId = data?.user?.id;
        if (userId) {
          localStorage.setItem("user_id", userId);
          console.log("Logged in user:", userId);
        }

        // Prefer saved display name in metadata, otherwise derive from email
        const displayName =
          data?.user?.user_metadata?.name ||
          form.name.trim() ||
          form.email.split("@")[0];

        onLogin(displayName);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <BackgroundOrbs variant="auth" />

      {/* Back button */}
      <button
        onClick={() => onNavigate("landing")}
        style={{
          position: "fixed", top: 22, left: 28, zIndex: 100,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(235,244,221,0.7)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(144,171,139,0.25)", borderRadius: 50,
          padding: "8px 18px 8px 14px", color: "var(--secondary)",
          fontSize: 14, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(144,171,139,0.15)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(235,244,221,0.7)"}
      >
        ← Back
      </button>

      <div className="glass-card anim-scale" style={{ width: "100%", maxWidth: 420, padding: "48px 44px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Logo size="lg" />
          <p style={{ marginTop: 12, fontSize: 14, color: "rgba(59,73,83,0.55)", fontWeight: 300 }}>
            {mode === "login" ? "Welcome back. We've missed you." : "Start your healing journey today."}
          </p>
        </div>

        {/* Toggle — Sign In / Register */}
        <div style={{ display: "flex", background: "rgba(144,171,139,0.12)", borderRadius: 50, padding: 4, marginBottom: 32 }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 50, border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, transition: "all 0.25s",
                background: mode === m
                  ? "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)"
                  : "transparent",
                color: mode === m ? "#fff" : "var(--secondary)",
                boxShadow: mode === m ? "0 3px 12px rgba(90,120,99,0.3)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Name — register only */}
          {mode === "register" && (
            <div className="anim-fade">
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>
                YOUR NAME
              </label>
              <input
                className="s-input"
                placeholder="What should we call you?"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>
              EMAIL
            </label>
            <input
              className="s-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="s-input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: 46 }}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(59,73,83,0.45)", fontSize: 13, fontFamily: "var(--font-body)",
                }}
              >
                {showPw ? "hide" : "show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="anim-fade" style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(201,122,122,0.1)", border: "1px solid rgba(201,122,122,0.25)",
              fontSize: 13, color: "#C97A7A",
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="anim-fade" style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(144,171,139,0.12)", border: "1px solid rgba(144,171,139,0.3)",
              fontSize: 13, color: "var(--secondary)",
            }}>
              ✓ {success}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          >
            {loading
              ? <div style={{ display: "flex", gap: 5 }}>
                <div className="loader-dot" />
                <div className="loader-dot" />
                <div className="loader-dot" />
              </div>
              : mode === "login" ? "Sign In →" : "Create Account →"
            }
          </button>
        </div>

        {/* Switch mode */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(59,73,83,0.45)" }}>
          {mode === "login" ? "New to Serelyn? " : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
            style={{ color: "var(--secondary)", cursor: "pointer", fontWeight: 500 }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const handleLogin = (name) => {
    setUser(name);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user_id");
    setPage("landing");
  };

  return (
    <>
      <GlobalStyles />
      {page === "landing" && <LandingPage onNavigate={setPage} />}
      {page === "auth" && <AuthPage onNavigate={setPage} onLogin={handleLogin} />}
      {page === "dashboard" && (
        <Chat
          user={user}
          onLogout={handleLogout}
          onNavigateHome={() => setPage("landing")}
        />
      )}
    </>
  );
}