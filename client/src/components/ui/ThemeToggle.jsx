import { useTheme } from "../../context/ThemeContext";

const LABELS = {
  "dark-purple": { icon: "✦", label: "Black & Purple" },
  "light-white":  { icon: "✧", label: "White & Purple" },
  "light-blue":   { icon: "✧", label: "White & Purple" },
};

export function ThemeToggle({ className = "", variant = "default" }) {
  const { theme, cycleTheme } = useTheme();
  const current = LABELS[theme] ?? LABELS["dark-purple"];
  const isShell = variant === "shell";

  return (
    <button
      onClick={cycleTheme}
      className={className}
      title={`Theme: ${current.label} — click to switch`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: isShell ? "8px 14px" : "6px 14px",
        borderRadius: "9999px",
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        color: "var(--text-muted)",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isShell ? "var(--shell-toggle-hover-border, rgba(248,113,113,0.28))" : "var(--border-hover)";
        e.currentTarget.style.color = "var(--text)";
        if (isShell) {
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.18)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isShell ? "var(--shell-toggle-border, rgba(255,255,255,0.08))" : "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
        if (isShell) {
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <span style={{ fontSize: "1rem" }}>{current.icon}</span>
      {current.label}
    </button>
  );
}
