import React from "react";
import { Shield, Activity, Smartphone, Monitor, RefreshCw, AlertTriangle, Cpu, Layers, Sun, Moon, History, Settings } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

export default function Navbar({
  viewMode,
  setViewMode,
  useAIPlan,
  setUseAIPlan,
  theme,
  setTheme,
  simulatedIncident,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onOpenIncidentModal,
  onOpenHistory,
  onOpenSettings,
  onResetData
}) {
  return (
    <header style={{
      height: "64px",
      backgroundColor: "var(--bg-panel)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.25rem",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      transition: "background-color 0.3s ease"
    }}>
      {/* Brand & Emblem */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "0.5rem",
          background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)"
        }}>
          <Shield style={{ color: "#FFF", width: "22px", height: "22px" }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
              NAGPUR TRAFFIC AI
            </h1>
            <span style={{
              background: "rgba(59, 130, 246, 0.15)",
              color: "#60A5FA",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              fontSize: "0.65rem",
              fontWeight: "700",
              padding: "0.1rem 0.4rem",
              borderRadius: "0.25rem",
              textTransform: "uppercase"
            }}>
              HACKATHON DEMO v2.0
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: 0 }}>
            Risk Heatmap & Police Deployment Command Center
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: "flex",
        background: "var(--bg-card)",
        padding: "3px",
        borderRadius: "0.5rem",
        border: "1px solid var(--border-color)"
      }}>
        <button
          onClick={() => setViewMode("CONTROL_ROOM")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "0.375rem",
            border: "none",
            background: viewMode === "CONTROL_ROOM" ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "transparent",
            color: viewMode === "CONTROL_ROOM" ? "#FFF" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <Monitor style={{ width: "15px", height: "15px" }} />
          Control Room Command Center
        </button>
        <button
          onClick={() => setViewMode("CITIZEN")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "0.375rem",
            border: "none",
            background: viewMode === "CITIZEN" ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
            color: viewMode === "CITIZEN" ? "#FFF" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <Smartphone style={{ width: "15px", height: "15px" }} />
          Citizen Reporting App
        </button>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Baseline vs AI Toggle */}
        {viewMode === "CONTROL_ROOM" && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "var(--bg-card)",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid var(--border-color)"
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>Plan:</span>
            <button
              onClick={() => setUseAIPlan(!useAIPlan)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.25rem 0.6rem",
                borderRadius: "0.25rem",
                border: "none",
                background: useAIPlan ? "#10B981" : "#64748B",
                color: "#FFF",
                fontWeight: "700",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
            >
              {useAIPlan ? <Cpu style={{ width: "13px", height: "13px" }} /> : <Layers style={{ width: "13px", height: "13px" }} />}
              {useAIPlan ? "AI Optimized" : "Baseline"}
            </button>
          </div>
        )}

        {/* Live Incident Simulator Trigger */}
        <button
          onClick={onOpenIncidentModal}
          className="btn-danger"
          style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
        >
          <AlertTriangle style={{ width: "15px", height: "15px" }} />
          {simulatedIncident ? "Active Incident Live" : "Simulate Incident"}
        </button>

        {/* Notifications Bell Dropdown */}
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={onMarkNotificationRead}
          onClearAll={onClearNotifications}
        />

        {/* History Log Drawer Button */}
        <button
          onClick={onOpenHistory}
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            padding: "0.4rem",
            borderRadius: "0.375rem",
            cursor: "pointer"
          }}
          title="History Log Timeline"
        >
          <History style={{ width: "16px", height: "16px" }} />
        </button>

        {/* Theme Mode Quick Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            padding: "0.4rem",
            borderRadius: "0.375rem",
            cursor: "pointer"
          }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun style={{ width: "16px", height: "16px", color: "#F59E0B" }} /> : <Moon style={{ width: "16px", height: "16px", color: "#3B82F6" }} />}
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            padding: "0.4rem",
            borderRadius: "0.375rem",
            cursor: "pointer"
          }}
          title="Settings & Preferences"
        >
          <Settings style={{ width: "16px", height: "16px" }} />
        </button>

        {/* Reset Data */}
        <button
          onClick={onResetData}
          title="Reset Seed Data"
          style={{
            background: "transparent",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            padding: "0.4rem",
            borderRadius: "0.375rem",
            cursor: "pointer"
          }}
        >
          <RefreshCw style={{ width: "15px", height: "15px" }} />
        </button>
      </div>
    </header>
  );
}
