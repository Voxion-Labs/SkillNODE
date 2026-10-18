import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Swords, Users } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { skillTracks } from "../data/skillTracks";

const CATEGORIES = ["All", "Speed", "Logic", "Language", "Developer"];
const TRACK_CATEGORY = {
  typing: "Speed", math: "Logic", guess: "Logic",
  code: "Developer", grammar: "Language", comprehension: "Language",
};

const labHighlights = [
  "Typing speed and rhythm testing",
  "Coding challenge workflows and test execution",
  "Math pressure drills with level progression",
  "Word and number guessing for lighter game loops",
  "Grammar and comprehension for language improvement",
  "AI hints, profile sharing, and multiplayer foundations",
];

export function ActivitiesPage() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered = activeCat === "All"
    ? skillTracks
    : skillTracks.filter((t) => TRACK_CATEGORY[t.slug] === activeCat);

  return (
    <div className="flex-col-fill" style={{ gap: 24, paddingBottom: 48 }}>

      {/* ── Header card ── */}
      <Card style={{ padding: "28px 32px", flexShrink: 0, borderRadius: "20px" }}>
        <div className="app-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 28, alignItems: "start" }}>
          <div>
            <span className="flutter-pill-tag">Execution Labs</span>
            <div className="display-title" style={{ fontSize: "2rem", color: "var(--text)", marginTop: 8 }}>
              Modular practice tracks for every discipline.
            </div>
            <div style={{ marginTop: 10, fontSize: "0.95rem", lineHeight: 1.75, color: "var(--text-muted)" }}>
              Each module opens an isolated, focused arena with its own local telemetry, difficulty progression, and AI coaching loops.
            </div>
            <div className="app-action-row" style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Button as={Link} to="/activities/code" style={{ padding: "0 26px" }}>Open Code Arena</Button>
              <Button as={Link} to="/multiplayer" variant="secondary" style={{ padding: "0 22px" }}>Social Battle Rooms</Button>
            </div>
          </div>

          <div className="app-card-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {labHighlights.map((item) => (
              <div key={item} style={{
                borderRadius: "14px", border: "1px solid var(--border-subtle)",
                background: "var(--surface-2)", padding: "14px 16px",
                fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.6,
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Filter tabs (Flutter Pill Style) ── */}
      <div className="page-tabs" style={{ flexShrink: 0, display: "flex", gap: "10px", background: "transparent", border: "none", padding: "0" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`page-tab${activeCat === c ? " active" : ""}`}
            onClick={() => setActiveCat(c)}
            style={{ borderRadius: "9999px", padding: "9px 22px", fontSize: "0.85rem", fontWeight: 700 }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Track grid ── */}
      <div
        className="app-card-grid-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {filtered.map((track) => (
          <Link key={track.slug} to={track.route} className="group" style={{ textDecoration: "none" }}>
            <Card style={{ height: "100%", padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{
                height: 6, borderRadius: "9999px",
                background: "var(--btn-bg)",
                marginBottom: 16, opacity: 0.9,
              }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div className="label-sm" style={{ marginBottom: 4, color: "var(--accent-bright)" }}>{track.eyebrow}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{track.title}</div>
                </div>
                <ArrowUpRight size={18} style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: 2 }} />
              </div>
              <div style={{ marginTop: 10, fontSize: "0.85rem", lineHeight: 1.65, color: "var(--text-muted)", flex: 1 }}>
                {track.summary}
              </div>
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[track.duration, track.multiplayer, track.ai].map((tag) => (
                  <span key={tag} className="badge" style={{ borderRadius: "9999px", padding: "4px 12px" }}>{tag}</span>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Promo row ── */}
      <div className="app-promo-grid app-card-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 8, flexShrink: 0 }}>
        <PromoCard
          icon={Sparkles}
          title="AI hints where they matter"
          copy="Typing, math, coding, grammar, and reading pages can call the backend hint service for lightweight coaching."
        />
        <PromoCard
          icon={Swords}
          title="Competition-ready surfaces"
          copy="Use challenge pages for practice now, then extend them into duels, tournaments, and coding contests."
        />
        <PromoCard
          icon={Users}
          title="Built for connections"
          copy="Profiles, room presence, and public sharing make it easy to connect learning with community."
        />
      </div>
    </div>
  );
}

function PromoCard({ icon: Icon, title, copy }) {
  return (
    <Card style={{ padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div className="accent-block" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }}>
        <Icon size={16} style={{ color: "var(--accent)" }} />
      </div>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text)" }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: "0.775rem", lineHeight: 1.6, color: "var(--text-muted)" }}>{copy}</div>
      </div>
    </Card>
  );
}
