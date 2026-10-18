import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Lock,
  MailCheck,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  UploadCloud,
  UserRound,
  Zap,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ToastProvider, useToast } from "../components/ui/Toast";
import {
  createSessionProfile,
  getSessionProfile,
  loginWithCredentials,
} from "../lib/localStore";

function LoginInner() {
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dpFile, setDpFile] = useState(null);

  // Sign-in form state
  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  // Sign-up form state (no phone number!)
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    region: "",
  });

  useEffect(() => {
    const profile = getSessionProfile();
    if (!profile) return;
    setLoginForm((prev) => ({
      ...prev,
      usernameOrEmail: profile.username || profile.email || profile.name || "",
    }));
    setSignupForm({
      name: profile.name || "",
      username: profile.username || "",
      email: profile.email || "",
      password: profile.password || "",
      region: profile.region || "",
    });
  }, []);

  const dpPreview = useMemo(() => {
    if (!dpFile) return null;
    return URL.createObjectURL(dpFile);
  }, [dpFile]);

  async function handleSignIn(e) {
    if (e) e.preventDefault();
    if (!loginForm.usernameOrEmail.trim()) {
      toast.push({
        title: "Missing credential",
        message: "Please enter your username or email.",
        kind: "error",
      });
      return;
    }
    setBusy(true);
    try {
      await loginWithCredentials({
        usernameOrEmail: loginForm.usernameOrEmail,
        password: loginForm.password,
      });
      toast.push({
        title: "Welcome back!",
        message: "Authenticated into SkillNODE arena.",
        kind: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      toast.push({
        title: "Authentication Failed",
        message: err?.message || "Invalid credentials provided.",
        kind: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!signupForm.name.trim() || !signupForm.username.trim() || !signupForm.email.trim()) {
      toast.push({
        title: "Required fields",
        message: "Please fill out your name, username, and email.",
        kind: "error",
      });
      return;
    }
    setBusy(true);
    try {
      await createSessionProfile({
        name: signupForm.name,
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        region: signupForm.region || "Global",
        dpFile,
      });
      toast.push({
        title: "Welcome to SkillNODE",
        message: "Your professional skill profile is ready.",
        kind: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      toast.push({
        title: "Sign-up failed",
        message: err?.message || "Unable to provision profile right now.",
        kind: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleInstantDemo() {
    setBusy(true);
    try {
      await loginWithCredentials({
        usernameOrEmail: "alex_coder",
        password: "demo_password",
      });
      toast.push({
        title: "Demo Access Granted",
        message: "Entering SkillNODE as operator Alex Coder.",
        kind: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      toast.push({
        title: "Demo Error",
        message: err?.message || "Could not launch demo profile.",
        kind: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="login-scene">
      {/* ── Top Announcement Banner (Flutter Style) ── */}
      <div className="flutter-banner">
        <span>⚡ SkillNODE 2026 Engine is live! Advanced multi-language arena, real-time presence & AI telemetry.</span>
        <a href="#tracks" onClick={(e) => { e.preventDefault(); scrollToSection("tracks"); }}>
          Explore tracks <ArrowRight size={13} />
        </a>
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="flutter-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo.png"
            alt="SkillNODE logo"
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "contain" }}
          />
          <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Skill<span style={{ color: "var(--accent-bright)" }}>NODE</span>
          </span>
        </div>

        <nav style={{ display: "none", alignItems: "center", gap: 8 }} className="md:flex">
          <button onClick={() => scrollToSection("tracks")} className="flutter-nav-link" style={{ background: "transparent", border: "none" }}>
            Skill Tracks
          </button>
          <button onClick={() => scrollToSection("features")} className="flutter-nav-link" style={{ background: "transparent", border: "none" }}>
            Architecture
          </button>
          <button onClick={() => scrollToSection("benchmarks")} className="flutter-nav-link" style={{ background: "transparent", border: "none" }}>
            Benchmarks
          </button>
          <button onClick={() => scrollToSection("enterprise")} className="flutter-nav-link" style={{ background: "transparent", border: "none" }}>
            Enterprise
          </button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => scrollToSection("auth-portal")}
            style={{ padding: "0 18px" }}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* ── Hero Section (Flutter.dev Style) ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "50px 24px 60px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>

          {/* Left Column: Brand Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <span className="flutter-pill-tag">
                <Sparkles size={13} />
                Skill Development Infrastructure
              </span>
            </div>

            <h1 className="display-title" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", color: "var(--text)", margin: 0 }}>
              Reach your peak on every skill.
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0, maxWidth: 540 }}>
              Deploy your potential across typing velocity, advanced academic mathematics, multi-language coding, and real-time multiplayer arenas. Engineered for serious operators who need deterministic progress.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", paddingTop: 4 }}>
              <Button
                size="lg"
                onClick={() => scrollToSection("auth-portal")}
                style={{ padding: "0 30px", fontSize: "0.95rem" }}
              >
                Enter Arena <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection("tracks")}
                style={{ padding: "0 24px" }}
              >
                See the tracks
              </Button>
            </div>

            {/* Metric pill row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text)" }}>0 ms</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Local Latency</div>
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-bright)" }}>6 Tracks</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Multi-Domain</div>
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text)" }}>100%</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Fair-Play Verify</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: MNC Auth Portal Card */}
          <motion.div
            id="auth-portal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="login-card">
              {/* Card Header & Tabs */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div className="hero-kicker" style={{ fontSize: "0.7rem", letterSpacing: "0.12em" }}>Access Gateway</div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text)", margin: "3px 0 0" }}>
                    {mode === "signin" ? "Sign in to SkillNODE" : "Create Operator Profile"}
                  </h2>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }} />
              </div>

              {/* Mode Switcher Pills */}
              <div style={{
                display: "flex",
                background: "var(--surface-2)",
                padding: 4,
                borderRadius: 9999,
                border: "1px solid var(--border-subtle)",
                marginBottom: 20,
              }}>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  style={{
                    flex: 1,
                    padding: "7px 12px",
                    borderRadius: 9999,
                    border: "none",
                    background: mode === "signin" ? "var(--btn-bg)" : "transparent",
                    color: mode === "signin" ? "#fff" : "var(--text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    flex: 1,
                    padding: "7px 12px",
                    borderRadius: 9999,
                    border: "none",
                    background: mode === "signup" ? "var(--btn-bg)" : "transparent",
                    color: mode === "signup" ? "#fff" : "var(--text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* SIGN IN FORM */}
              {mode === "signin" ? (
                <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field label="Username or Email" icon={UserRound}>
                    <Input
                      value={loginForm.usernameOrEmail}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, usernameOrEmail: e.target.value }))}
                      placeholder="e.g. alex_coder or alex@skillnode.dev"
                      required
                      autoComplete="username"
                    />
                  </Field>

                  <Field label="Password" icon={Lock}>
                    <div style={{ position: "relative" }}>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••"
                        required
                        autoComplete="current-password"
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-faint)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <Button className="mt-2" size="lg" disabled={busy} style={{ width: "100%" }}>
                    {busy ? "Authenticating..." : "Enter SkillNODE →"}
                  </Button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0" }}>
                    <div style={{ height: 1, flex: 1, background: "var(--border-subtle)" }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", padding: "0 10px" }}>OR</span>
                    <div style={{ height: 1, flex: 1, background: "var(--border-subtle)" }} />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleInstantDemo}
                    disabled={busy}
                    style={{ width: "100%", fontSize: "0.825rem" }}
                  >
                    <Zap size={14} style={{ color: "var(--accent)" }} />
                    Instant Demo Access (0-Click Entry)
                  </Button>
                </form>
              ) : (
                /* SIGN UP FORM (NO PHONE NUMBER) */
                <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Avatar Upload */}
                  <div style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 14,
                    padding: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 12, overflow: "hidden",
                        background: "var(--input-bg)", border: "1px solid var(--input-border)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {dpPreview ? (
                          <img src={dpPreview} alt="DP preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <UploadCloud size={20} style={{ color: "var(--text-faint)" }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="label-sm" style={{ marginBottom: 4 }}>Avatar Picture</div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: "100%" }}
                          onChange={(e) => setDpFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Full Name" icon={UserRound}>
                      <Input
                        value={signupForm.name}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Alex Chen"
                        required
                      />
                    </Field>

                    <Field label="Username" icon={UserRound}>
                      <Input
                        value={signupForm.username}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, username: e.target.value }))}
                        placeholder="alex_coder"
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" icon={MailCheck}>
                    <Input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="alex@domain.com"
                      required
                    />
                  </Field>

                  <Field label="Password" icon={Lock}>
                    <div style={{ position: "relative" }}>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a strong password"
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-faint)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Region / Location" icon={MapPin}>
                    <Input
                      value={signupForm.region}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, region: e.target.value }))}
                      placeholder="e.g. San Francisco, CA / Global"
                    />
                  </Field>

                  <Button className="mt-2" size="lg" disabled={busy} style={{ width: "100%" }}>
                    {busy ? "Creating Profile..." : "Create Account & Enter →"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1: Flutter Multi-Screen Device Mockup Showcase ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="flutter-pill-tag">Interactive Surface</span>
          <h2 className="display-title" style={{ fontSize: "2.4rem", color: "var(--text)", marginTop: 10 }}>
            Unified execution across every track.
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 620, margin: "8px auto 0" }}>
            Experience instant feedback loops whether you are writing algorithm solutions, racing typing speed, or competing in multiplayer lobbies.
          </p>
        </div>

        {/* 3-Card Floating Device Perspective */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}>
          {/* Mockup 1: Code Arena */}
          <div className="showcase-screen" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Code2 size={18} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>Code Arena (JavaScript)</span>
              </div>
              <span className="badge" style={{ borderRadius: 9999 }}>Pass: 3/3 Tests</span>
            </div>
            <pre style={{
              background: "var(--surface-2)",
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              fontSize: "0.78rem",
              color: "#c084fc",
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
{`function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    if (intervals[i][0] <= prev[1]) {
      prev[1] = Math.max(prev[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged; // Complexity O(N log N)
}`}
            </pre>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "var(--surface-3)", padding: "4px 10px", borderRadius: 9999 }}>Memory: 14.2 MB</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "var(--surface-3)", padding: "4px 10px", borderRadius: 9999 }}>Latency: 1.2 ms</span>
            </div>
          </div>

          {/* Mockup 2: Typing Race */}
          <div className="showcase-screen" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Timer size={18} style={{ color: "#38bdf8" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>Typing Velocity Telemetry</span>
              </div>
              <span className="badge" style={{ borderRadius: 9999, background: "rgba(56,189,248,0.15)", color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" }}>
                Rank 1 • Master
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "var(--surface-2)", padding: 14, borderRadius: 12, border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)" }}>124</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Net WPM</div>
              </div>
              <div style={{ background: "var(--surface-2)", padding: 14, borderRadius: 12, border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-bright)" }}>99.6%</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Accuracy</div>
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", padding: 12, borderRadius: 10, fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              "The architecture of deterministic systems is designed to eliminate non-reproducible states at runtime..."
            </div>
          </div>

          {/* Mockup 3: Multiplayer Duel */}
          <div className="showcase-screen" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Swords size={18} style={{ color: "#ec4899" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>Realtime Multiplayer Battle</span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} /> Socket Live
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text)" }}>1. Alex Coder (You)</span>
                <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--accent-bright)" }}>1,480 pts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>2. Maya Lin (MIT)</span>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>1,410 pts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>3. David Kim (Google)</span>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>1,320 pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Six Supported Tracks ── */}
      <section id="tracks" style={{ position: "relative", zIndex: 1, padding: "60px 24px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="flutter-pill-tag">Core Capabilities</span>
          <h2 className="display-title" style={{ fontSize: "2.4rem", color: "var(--text)", marginTop: 10 }}>
            Structured Execution Tracks
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 580, margin: "8px auto 0" }}>
            Six dedicated cognitive and technical disciplines, engineered with zero trivial widgets.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <TrackCard
            icon={Code2}
            title="Multi-Language Code Arena"
            category="Engineering"
            summary="Full challenge tracks for JavaScript, Python, C++, Java, TypeScript, and SQL with unit test suites."
          />
          <TrackCard
            icon={BrainCircuit}
            title="Advanced Grade 11-12 Mathematics"
            category="Academic Logic"
            summary="Rigorous calculus, matrices, trigonometry, and algebraic speed drills replacing baseline arithmetic."
          />
          <TrackCard
            icon={Timer}
            title="Typing Velocity & Cadence"
            category="Speed"
            summary="Realtime burst speed telemetry, keypress cadence graphs, and fair-play input validation."
          />
          <TrackCard
            icon={Layers}
            title="Heuristic Estimation (Guess Labs)"
            category="Heuristics"
            summary="Fermi problem estimation, order-of-magnitude analysis, and quantitative intuition tests."
          />
          <TrackCard
            icon={CheckCircle2}
            title="Grammar & Syntax Engine"
            category="Language"
            summary="Syntactical error pinpointing, punctuation precision, and structural sentence mastery."
          />
          <TrackCard
            icon={Globe}
            title="Cognitive Reading Comprehension"
            category="Analytical"
            summary="Rapid analytical text processing, inference extraction, and technical document comprehension."
          />
        </div>
      </section>

      {/* ── Section 3: MNC Architecture & Security ── */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "60px 24px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="flutter-pill-tag">Infrastructure</span>
          <h2 className="display-title" style={{ fontSize: "2.4rem", color: "var(--text)", marginTop: 10 }}>
            Engineered for High-Reliability Operations
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 620, margin: "8px auto 0" }}>
            The architectural blueprint underpinning SkillNODE delivers institutional-grade performance and zero-friction execution.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          <FeatureBlock
            icon={Zap}
            title="Zero-Latency Local-First"
            body="Progress is saved instantly in client-side storage protocols, ensuring zero network latency during fast drills."
          />
          <FeatureBlock
            icon={Radio}
            title="WebSocket Realtime"
            body="Socket.IO synchronization drives peer-to-peer presence, room matchmaking, and spectator synchronization."
          />
          <FeatureBlock
            icon={BrainCircuit}
            title="AI Algorithmic Coaching"
            body="Integrated OpenAI hints provide contextual algorithmic nudges without spoiling solution architectures."
          />
          <FeatureBlock
            icon={ShieldCheck}
            title="Fair-Play Telemetry"
            body="Client-side anomaly logging monitors window blur, keystroke cadence, and paste events to protect integrity."
          />
        </div>
      </section>

      {/* ── Section 4: MNC Platform Comparison Matrix ── */}
      <section id="benchmarks" style={{ position: "relative", zIndex: 1, padding: "60px 24px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="flutter-pill-tag">Benchmark Comparison</span>
          <h2 className="display-title" style={{ fontSize: "2.4rem", color: "var(--text)", marginTop: 10 }}>
            Why SkillNODE Leads the Sector
          </h2>
        </div>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflowX: "auto",
          boxShadow: "var(--card-shadow)",
          WebkitOverflowScrolling: "touch",
        }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "16px 20px", color: "var(--text)", fontWeight: 700 }}>Capability</th>
                <th style={{ padding: "16px 20px", color: "var(--accent-bright)", fontWeight: 800 }}>SkillNODE</th>
                <th style={{ padding: "16px 20px", color: "var(--text-muted)", fontWeight: 600 }}>Fragmented Tools</th>
                <th style={{ padding: "16px 20px", color: "var(--text-muted)", fontWeight: 600 }}>Toy Widgets</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow metric="Execution Latency" skillnode="Sub-millisecond (0ms)" others="200-500ms network roundtrip" toys="Variable / Laggy" />
              <ComparisonRow metric="Identity & Public Profile" skillnode="Cryptographic Share Card" others="Isolated account silos" toys="None (Ephemeral)" />
              <ComparisonRow metric="Multi-Language Code Runner" skillnode="JS, PY, C++, Java, TS, SQL" others="Single language only" toys="None" />
              <ComparisonRow metric="Real-time Multiplayer Presence" skillnode="Socket.IO Room Engine" others="Limited or Asynchronous" toys="None" />
              <ComparisonRow metric="Academic Mathematics" skillnode="Grade 11-12 Calculus/Algebra" others="Basic Arithmetic only" toys="Elementary" />
              <ComparisonRow metric="Anti-Cheat & Fair-Play" skillnode="Client Cadence Anomaly Log" others="None" toys="None" />
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 5: MNC Testimonials & Enterprise ── */}
      <section id="enterprise" style={{ position: "relative", zIndex: 1, padding: "60px 24px", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="flutter-pill-tag">Operator Endorsements</span>
          <h2 className="display-title" style={{ fontSize: "2.4rem", color: "var(--text)", marginTop: 10 }}>
            Trusted by Builders & Researchers
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          <TestimonialCard
            quote="SkillNODE brings the authoritative discipline of terminal software to browser-based training. The local-first speed is unmatched."
            author="David Kim"
            role="Staff Software Engineer, Ex-Google"
          />
          <TestimonialCard
            quote="Replacing elementary arithmetic with genuine Grade 11-12 mathematics makes this an essential platform for technical students."
            author="Dr. Elena Rostova"
            role="Computational Mathematics Researcher"
          />
          <TestimonialCard
            quote="The seamless combination of typing cadence, multi-language coding, and multiplayer duels makes daily practice addictive."
            author="Marcus Vance"
            role="Competitive Operator & Hackathon Finalist"
          />
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px", textAlign: "center" }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "48px 32px",
          background: "linear-gradient(180deg, var(--surface), var(--surface-2))",
          border: "1px solid var(--border)",
          borderRadius: 24,
          boxShadow: "var(--card-shadow)",
        }}>
          <h2 className="display-title" style={{ fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>
            Step into the arena today.
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: "14px 0 24px" }}>
            Zero setup required. Your local skill profile initializes in milliseconds.
          </p>
          <Button
            size="lg"
            onClick={() => scrollToSection("auth-portal")}
            style={{ padding: "0 36px" }}
          >
            Launch SkillNODE Now →
          </Button>
        </div>
      </section>

      {/* ── MNC Mega Footer (PRESERVING SIGNATURE AND FOOTER) ── */}
      <footer style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface)",
        padding: "50px 24px 30px",
        marginTop: "auto",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36, paddingBottom: 40, borderBottom: "1px solid var(--border-subtle)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src="/logo.png" alt="SkillNODE logo" style={{ width: 28, height: 28, borderRadius: "50%" }} />
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>SkillNODE</span>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              A deterministic local-first skill training infrastructure engineered for structured practice, professional identity, and multiplayer competition.
            </p>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Skill Tracks</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.825rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Typing Velocity</li>
              <li>Advanced Mathematics</li>
              <li>Multi-Language Code Arena</li>
              <li>Grammar & Syntactical Engine</li>
              <li>Cognitive Reading</li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Platform</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.825rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Local-First Zero Latency</li>
              <li>Realtime Socket.IO Presence</li>
              <li>OpenAI Diagnostic Hints</li>
              <li>Fair-Play Verification</li>
              <li>Public Profile Cards</li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Company & Legal</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.825rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Voxion Labs Proprietary Research</li>
              <li>Security & Integrity Telemetry</li>
              <li>Terms of Service</li>
              <li>Privacy Architecture</li>
            </ul>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ maxWidth: 1240, margin: "24px auto 0", textAlign: "center", color: "var(--text-faint)", fontSize: "0.825rem", paddingTop: 16 }}>
          (c) Voxion Labs
        </div>
      </footer>
    </div>
  );
}

export function LoginPage() {
  return (
    <ToastProvider>
      <LoginInner />
    </ToastProvider>
  );
}

/* ── Auxiliary Subcomponents ── */

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: "0.72rem", fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--text-faint)", marginBottom: 6,
      }}>
        <Icon size={13} style={{ color: "var(--accent)" }} />
        {label}
      </label>
      {children}
    </div>
  );
}

function TrackCard({ icon: Icon, title, category, summary }) {
  return (
    <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} style={{ color: "var(--accent-bright)" }} />
        </div>
        <span className="badge" style={{ borderRadius: 9999 }}>{category}</span>
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{summary}</p>
    </div>
  );
}

function FeatureBlock({ icon: Icon, title, body }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={19} style={{ color: "var(--accent-bright)" }} />
      </div>
      <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--text)", margin: "0 0 6px" }}>{title}</h4>
      <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  );
}

function ComparisonRow({ metric, skillnode, others, toys }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <td style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text)" }}>{metric}</td>
      <td style={{ padding: "14px 20px", color: "var(--accent-bright)", fontWeight: 700 }}>{skillnode}</td>
      <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{others}</td>
      <td style={{ padding: "14px 20px", color: "var(--text-faint)" }}>{toys}</td>
    </tr>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <p style={{ fontSize: "0.925rem", color: "var(--text)", lineHeight: 1.65, fontStyle: "italic", margin: "0 0 16px" }}>
        "{quote}"
      </p>
      <div>
        <div style={{ fontWeight: 800, color: "var(--text)", fontSize: "0.9rem" }}>{author}</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 2 }}>{role}</div>
      </div>
    </div>
  );
}
