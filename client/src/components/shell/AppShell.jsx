import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutGrid, Swords, Trophy, UserCircle2, LogOut,
  ShieldCheck, Radio, Zap,
} from "lucide-react";
import { cn } from "../ui/cn";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Avatar } from "../ui/Avatar";
import { ToastProvider, useToast } from "../ui/Toast";
import { clearToken } from "../../lib/auth";
import { getSessionProfile } from "../../lib/localStore";
import { resolveMediaUrl } from "../../lib/media";
import { closeSocket } from "../../lib/socket";

const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",  icon: LayoutGrid  },
  { to: "/activities", label: "Skill Labs",  icon: Trophy      },
  { to: "/multiplayer",label: "Multiplayer", icon: Swords      },
  { to: "/profile",    label: "Profile",     icon: UserCircle2 },
];

function ShellInner() {
  const navigate = useNavigate();
  const toast = useToast();
  const [me, setMe] = useState(null);

  useEffect(() => {
    function syncProfile() {
      const profile = getSessionProfile();
      if (!profile) { clearToken(); navigate("/login", { replace: true }); return; }
      setMe(profile);
    }
    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("focus",   syncProfile);
    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("focus",   syncProfile);
    };
  }, [navigate]);

  function handleSignOut() {
    closeSocket();
    clearToken();
    toast.push({ title: "Signed out", message: "See you soon.", kind: "success" });
    navigate("/login");
  }

  return (
    <div className="app-shell" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* ── Top Announcement Banner (Flutter Style) ── */}
      <div className="flutter-banner" style={{ flexShrink: 0, padding: "6px 16px", fontSize: "0.78rem" }}>
        <span>⚡ SkillNODE 2026 Engine is live! Advanced coding arena, real-time presence & AI telemetry active.</span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <aside className="sidebar" style={{ padding: "0", height: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
          {/* Logo + branding */}
          <div className="shell-brand" style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}>
            <div className="shell-brand-lockup" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/logo.png" alt="SkillNODE" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "contain" }} />
              <div>
                <div className="hero-kicker" style={{ fontSize: "0.625rem", letterSpacing: "0.14em" }}>Skill Arena</div>
                <div className="display-title" style={{ fontSize: "1.1rem", lineHeight: 1.15, color: "var(--text)" }}>SkillNODE</div>
              </div>
            </div>
          </div>

          {/* Player card */}
          <div className="shell-player-card" style={{
            margin: "12px 12px 8px",
            padding: "12px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            flexShrink: 0,
          }}>
            <div className="label-sm" style={{ marginBottom: "8px", fontSize: "0.68rem" }}>Operator</div>
            <div className="shell-player-main" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                src={me?.dpUrl ? resolveMediaUrl(me.dpUrl) : null}
                name={me?.name || "O"}
                size="sm"
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {me?.name || "Operator"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--accent-bright)", marginTop: "1px", fontWeight: 600 }}>
                  @{me?.username || "operator"}
                </div>
              </div>
            </div>
            {/* Status pills */}
            <div className="shell-status-row" style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
              <div className="shell-status-pill" style={{ flex: 1, padding: "5px 8px", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <ShieldCheck size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>Fair play</span>
              </div>
              <div className="shell-status-pill" style={{ flex: 1, padding: "5px 8px", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <span className="status-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>Live</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="shell-nav" style={{ padding: "0 12px", flex: 1, overflowY: "auto", minHeight: 0 }}>
            <div className="label-sm" style={{ padding: "6px 8px", fontSize: "0.68rem" }}>Tracks & Systems</div>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn("nav-item", isActive && "active")}
                style={{ marginBottom: "4px" }}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="shell-footer" style={{
            padding: "14px",
            borderTop: "1px solid var(--border-subtle)",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "var(--sidebar-bg)",
          }}>
            <ThemeToggle className="shell-theme-toggle" variant="shell" />
            <button
              onClick={handleSignOut}
              className="btn btn-ghost shell-footer-action"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                gap: "8px",
                fontSize: "0.825rem",
                borderRadius: "9999px",
                height: "38px",
                color: "var(--text-muted)",
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="main-area">
          {/* Slim top bar */}
          <div className="top-bar">
            <div className="top-bar-title" style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <Zap size={14} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>
                SkillNODE Command Center
              </span>
            </div>
            <div className="top-bar-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="top-bar-live" style={{
                fontSize: "0.72rem", fontWeight: 700,
                padding: "3px 12px",
                borderRadius: "9999px",
                letterSpacing: "0.06em",
              }}>
                <Radio size={10} style={{ display: "inline", marginRight: 4 }} />
                LIVE NODE
              </div>
            </div>
          </div>

        {/* Page content */}
        <div className="page-frame">
          <motion.div
            key="outlet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="flex-col-fill"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        background: "var(--sidebar-bg)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "6px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
        className="mobile-nav shell-mobile-nav"
      >
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn("nav-item", isActive && "active")}
            style={{ flexDirection: "column", gap: "2px", padding: "8px 12px", fontSize: "0.68rem" }}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function AppShell() {
  return (
    <ToastProvider>
      <ShellInner />
    </ToastProvider>
  );
}
