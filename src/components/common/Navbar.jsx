import React from "react";
import { Shield, Monitor, Smartphone, BarChart3, Users, AlertOctagon, AlertTriangle, Settings, User, Image, Sun, Moon } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

export default function Navbar({
  viewMode,
  setViewMode,
  useAIPlan,
  setUseAIPlan,
  theme,
  setTheme,
  isCommandRoomBg,
  setIsCommandRoomBg,
  simulatedIncident,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onOpenIncidentModal,
  onOpenSettings,
  onOpenIncidentLogs
}) {
  return (
    <header style={{
      height: "64px",
      background: "var(--bg-panel)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.25rem",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
    }}>
      {/* Left Branding Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 16px rgba(0, 240, 255, 0.3)",
          border: "1px solid var(--accent-cyan)"
        }}>
          <Shield style={{ color: "#FFFFFF", width: "24px", height: "24px" }} />
        </div>
        <div>
          <h1 style={{
            fontSize: "1.2rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            letterSpacing: "0.08em",
            margin: 0,
            lineHeight: 1.1
          }}>
            NAGPUR TRAFFIC AI
          </h1>
          <span style={{
            fontSize: "0.68rem",
            color: "var(--accent-cyan)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
            fontWeight: "700"
          }}>
            INTELLIGENT TRAFFIC CONTROL CENTER
          </span>
        </div>
      </div>

      {/* Center Main Navigation Tabs */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "var(--bg-card)",
        padding: "4px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)"
      }}>
        <button
          onClick={() => setViewMode("CONTROL_ROOM")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: viewMode === "CONTROL_ROOM" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
            background: viewMode === "CONTROL_ROOM" ? "var(--accent-cyan-bg)" : "transparent",
            color: viewMode === "CONTROL_ROOM" ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.04em"
          }}
        >
          <Monitor style={{ width: "15px", height: "15px" }} />
          CONTROL ROOM
        </button>

        <button
          onClick={onOpenIncidentLogs}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: viewMode === "INCIDENT_LOGS" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
            background: viewMode === "INCIDENT_LOGS" ? "var(--accent-cyan-bg)" : "transparent",
            color: viewMode === "INCIDENT_LOGS" ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.04em"
          }}
        >
          <AlertOctagon style={{ width: "15px", height: "15px" }} />
          INCIDENT LOGS
        </button>

        <button
          onClick={() => setViewMode("CITIZEN")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: viewMode === "CITIZEN" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
            background: viewMode === "CITIZEN" ? "var(--accent-cyan-bg)" : "transparent",
            color: viewMode === "CITIZEN" ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.04em"
          }}
        >
          <Smartphone style={{ width: "15px", height: "15px" }} />
          CITIZEN REPORTING
        </button>

        <button
          onClick={() => setViewMode("ANALYTICS")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: viewMode === "ANALYTICS" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
            background: viewMode === "ANALYTICS" ? "var(--accent-cyan-bg)" : "transparent",
            color: viewMode === "ANALYTICS" ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.04em"
          }}
        >
          <BarChart3 style={{ width: "15px", height: "15px" }} />
          ANALYTICS
        </button>

        <button
          onClick={() => setViewMode("DEPLOYMENT")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: viewMode === "DEPLOYMENT" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
            background: viewMode === "DEPLOYMENT" ? "var(--accent-cyan-bg)" : "transparent",
            color: viewMode === "DEPLOYMENT" ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.04em"
          }}
        >
          <Users style={{ width: "15px", height: "15px" }} />
          DEPLOYMENT
        </button>
      </nav>

      {/* Right Header Status Pills & Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Background Mode Switcher */}
        <button
          onClick={() => setIsCommandRoomBg(!isCommandRoomBg)}
          title="Toggle Command Center Glass Backdrop Mode"
          style={{
            background: isCommandRoomBg ? "var(--accent-cyan-bg)" : "var(--bg-card)",
            border: isCommandRoomBg ? "1px solid var(--accent-cyan)" : "1px solid var(--border-color)",
            color: isCommandRoomBg ? "var(--accent-cyan)" : "var(--text-secondary)",
            padding: "0.35rem 0.65rem",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontWeight: "600"
          }}
        >
          <Image style={{ width: "14px", height: "14px" }} />
          <span>{isCommandRoomBg ? "ROOM HUD" : "GIS MAP"}</span>
        </button>

        {/* AI OPTIMIZED Status Badge */}
        <div style={{
          background: "var(--risk-low-bg)",
          border: "1px solid var(--risk-low)",
          borderRadius: "20px",
          padding: "0.35rem 0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--risk-low)",
          fontWeight: "700"
        }}>
          <span className="pulse-green" style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--risk-low)",
            boxShadow: "0 0 10px var(--risk-low)"
          }}></span>
          AI OPTIMIZED
        </div>

        {/* SIMULATE INCIDENT Action Button */}
        <button
          onClick={onOpenIncidentModal}
          style={{
            background: "var(--risk-med-bg)",
            border: "1px solid var(--risk-med)",
            color: "var(--risk-med)",
            padding: "0.4rem 0.85rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-heading)",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            letterSpacing: "0.04em"
          }}
        >
          <AlertTriangle style={{ width: "15px", height: "15px" }} />
          {simulatedIncident ? "INCIDENT ACTIVE" : "SIMULATE INCIDENT"}
        </button>

        {/* Notifications Center */}
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={onMarkNotificationRead}
          onClearAll={onClearNotifications}
        />

        {/* Quick Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            padding: "0.45rem",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun style={{ width: "16px", height: "16px", color: "#FFB700" }} /> : <Moon style={{ width: "16px", height: "16px", color: "var(--accent-cyan)" }} />}
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            padding: "0.45rem",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
          title="Settings & System Preferences"
        >
          <Settings style={{ width: "16px", height: "16px" }} />
        </button>

        {/* User Profile Avatar Icon */}
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "var(--accent-cyan-bg)",
          border: "1px solid var(--accent-cyan)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-cyan)",
          cursor: "pointer"
        }} title="Commander R. Verma (Nagpur HQ)">
          <User style={{ width: "17px", height: "17px" }} />
        </div>
      </div>
    </header>
  );
}
