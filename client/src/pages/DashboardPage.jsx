import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, ShieldCheck, Users } from "lucide-react";
import { getLeaderboard, getSummary } from "../lib/localStore";
import { skillTracks } from "../data/skillTracks";
import { resolveMediaUrl } from "../lib/media";
import { Avatar } from "../components/ui/Avatar";

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    function sync() {
      setSummary(getSummary());
      setLeaderboard(getLeaderboard("typing", 6));
    }
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  const featuredTracks = skillTracks.slice(0, 4);
  const bestResults    = summary?.bestResults    || [];
  const recentResults  = summary?.recentResults  || [];

  return (
    <div className="flex-col-fill" style={{ gap: 24, paddingBottom: 48 }}>

      {/* ── Row 1: Metrics (Flutter Pill Style) ── */}
      <div className="app-card-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, flexShrink: 0 }}>
        <MetricBox label="Total Attempts" value={String(summary?.totals?.totalAttempts ?? 0)} />
        <MetricBox label="Integrity Alerts" value={String(summary?.totals?.alertCount ?? 0)} color="warning" />
        <MetricBox label="Personal Bests" value={String(bestResults.length)} />
        <MetricBox label="Live Competitors" value={`${leaderboard.length} online`} color="accent" />
      </div>

      {/* ── Row 2: Tracks + Leaderboard ── */}
      <div className="app-main-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 20 }}>

        {/* Track Cards grid */}
        <div className="card" style={{ padding: "26px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexShrink: 0 }}>
            <div>
              <span className="flutter-pill-tag" style={{ fontSize: "0.68rem", padding: "3px 10px" }}>Active Arena</span>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginTop: "4px" }}>
                Featured Execution Tracks
              </div>
            </div>
            <Link
              to="/activities"
              className="btn btn-ghost btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "5px", borderRadius: "9999px" }}
            >
              See all tracks <ArrowRight size={13} />
            </Link>
          </div>

          <div className="app-card-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {featuredTracks.map((track, i) => (
              <Link key={track.slug} to={track.route} style={{ textDecoration: "none" }}>
                <div
                  className={`card animate-slide-up stagger-${i + 1}`}
                  style={{
                    padding: "18px 20px", height: "100%", cursor: "pointer",
                    background: "var(--surface-2)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Flutter accent gradient strip */}
                  <div style={{
                    height: "4px", borderRadius: "9999px",
                    background: "var(--btn-bg)",
                    marginBottom: "12px",
                    opacity: 0.9,
                  }} />
                  <div className="label-sm" style={{ marginBottom: "4px", color: "var(--accent-bright)" }}>{track.eyebrow}</div>
                  <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.3 }}>
                    {track.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.55, flex: 1 }}>
                    {track.summary}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Leaderboard + Bests */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Leaderboard */}
          <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <div className="label-sm" style={{ marginBottom: "4px" }}>Typing Leaderboard</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: "14px" }}>
              Shared competition layer
            </div>
            <div className="inner-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              {leaderboard.length === 0 ? (
                <EmptyState text="Results appear after your first typing session." />
              ) : leaderboard.map((entry, i) => (
                <div key={entry.userId} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "5px",
                    background: i < 3 ? "var(--nav-active)" : "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 800,
                    color: i < 3 ? "var(--nav-active-fg)" : "var(--text-faint)",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <Avatar
                    src={entry.dpUrl ? resolveMediaUrl(entry.dpUrl) : null}
                    name={entry.name}
                    size="xs"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>{entry.region || "—"}</div>
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent-bright)", flexShrink: 0 }}>
                    {fmt(entry.bestScore)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent results */}
          <div className="card" style={{ padding: "20px 24px", borderRadius: "18px", flexShrink: 0 }}>
            <div className="label-sm" style={{ marginBottom: "10px" }}>Recent Sessions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentResults.length === 0 ? (
                <EmptyState text="No sessions yet. Start an activity." />
              ) : recentResults.slice(0, 3).map(r => (
                <div key={r.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                }}>
                  <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>
                    {r.activityType}
                  </span>
                  <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--accent-bright)" }}>
                    {fmt(r.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Signal cards ── */}
      <div className="app-promo-grid app-card-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 6, flexShrink: 0 }}>
        <SignalCard icon={BrainCircuit} title="AI coaching in context"
          copy="Hints are attached to each challenge surface so the product feels useful, not decorative." />
        <SignalCard icon={Users} title="Social by design"
          copy="Profiles, rooms, and public sharing make the platform feel alive rather than isolated." />
        <SignalCard icon={ShieldCheck} title="Fair-play logging"
          copy="Focus-loss, tab-switch, and key signals are logged against your active session." />
      </div>

    </div>
  );
}

/* ── Sub-components ── */

function MetricBox({ label, value, color }) {
  const textColor = color === "accent" ? "var(--accent-bright)"
    : color === "warning" ? "#f59e0b"
    : "var(--text)";
  return (
    <div className="metric-box" style={{ borderRadius: "18px", padding: "18px 22px", background: "var(--surface)" }}>
      <div className="label-sm" style={{ fontSize: "0.7rem" }}>{label}</div>
      <div style={{ marginTop: "6px", fontSize: "1.85rem", fontWeight: 800, color: textColor, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}>
        {value}
      </div>
    </div>
  );
}

function SignalCard({ icon: Icon, title, copy }) {
  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start", borderRadius: "18px" }}>
      <div className="accent-block" style={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0 }}>
        <Icon size={18} style={{ color: "var(--accent)" }} />
      </div>
      <div>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.55 }}>{copy}</div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{
      padding: "20px 12px", textAlign: "center",
      fontSize: "0.78rem", color: "var(--text-faint)",
      border: "1px dashed var(--border-subtle)",
      borderRadius: "8px",
    }}>
      {text}
    </div>
  );
}

function fmt(v) {
  return Number.isFinite(v) ? Number(v).toFixed(v % 1 === 0 ? 0 : 1) : "0";
}
