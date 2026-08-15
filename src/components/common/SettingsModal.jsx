import React from "react";
import { X, Settings, Moon, Sun, Volume2, VolumeX, RefreshCw, Map } from "lucide-react";

export default function SettingsModal({
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  autoRefreshSec,
  setAutoRefreshSec,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 7, 18, 0.75)",
      backdropFilter: "blur(6px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: "0.75rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        padding: "1.5rem"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings style={{ width: "20px", height: "20px", color: "#3B82F6" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              System Settings & Preferences
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* 1. Theme Selector */}
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>
              Visual Interface Theme Mode:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: theme === "dark" ? "2px solid #3B82F6" : "1px solid var(--border-color)",
                  background: theme === "dark" ? "#1E293B" : "var(--bg-card)",
                  color: theme === "dark" ? "#60A5FA" : "var(--text-secondary)",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                <Moon style={{ width: "18px", height: "18px" }} />
                Dark Theme (Control Room)
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: theme === "light" ? "2px solid #3B82F6" : "1px solid var(--border-color)",
                  background: theme === "light" ? "#F8FAFC" : "var(--bg-card)",
                  color: theme === "light" ? "#1E40AF" : "var(--text-secondary)",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                <Sun style={{ width: "18px", height: "18px" }} />
                Light Theme (Daylight)
              </button>
            </div>
          </div>

          {/* 2. Audio Alert Effect Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-card)", borderRadius: "0.5rem", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {soundEnabled ? <Volume2 style={{ color: "#10B981" }} /> : <VolumeX style={{ color: "var(--text-muted)" }} />}
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}>
                  Emergency Sound Alerts
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                  Play audio tone on incident triggers
                </span>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: soundEnabled ? "#10B981" : "var(--bg-hover)",
                color: "#FFF",
                border: "none",
                borderRadius: "9999px",
                padding: "0.3rem 0.8rem",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              {soundEnabled ? "ENABLED" : "OFF"}
            </button>
          </div>

          {/* 3. Risk Recalculation Speed */}
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
              AI Risk Engine Recalculation Interval:
            </label>
            <select
              value={autoRefreshSec}
              onChange={(e) => setAutoRefreshSec(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "0.65rem 0.75rem",
                borderRadius: "0.5rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value={5}>Fast (Every 5 seconds)</option>
              <option value={15}>Normal (Every 15 seconds)</option>
              <option value={30}>Eco (Every 30 seconds)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
