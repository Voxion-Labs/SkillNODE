import { useTheme } from "../../context/ThemeContext";

const LABELS = {
  "dark":         { icon: "☾", label: "Dark" },
  "light":        { icon: "☼", label: "Light" },
  "dark-purple":  { icon: "☾", label: "Dark" },
  "light-white":  { icon: "☼", label: "Light" },
  "light-blue":   { icon: "☼", label: "Light" },
};

export function ThemeToggle({ className = "", variant = "default" }) {
  const { theme, cycleTheme } = useTheme();
  const current = LABELS[theme] ?? LABELS["dark"];
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
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <span style={{ fontSize: "1rem" }}>{current.icon}</span>
      {current.label}
    </button>
  );
}
