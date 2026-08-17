import React from "react";
import { CheckCircle2, Navigation, AlertCircle } from "lucide-react";

export default function DashboardHeader({ metrics, activeZone, simulatedIncident, unmannedHotspotsCount, onOpenComparison }) {
  const { totalHighRisk, ai, improvement } = metrics;

  return (
    <div style={{
      position: "absolute",
      top: "16px",
      left: "280px",
      zIndex: 900,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      pointerEvents: "auto"
    }}>
      {/* Card 1: AI COVERAGE RATE */}
      <div className="glass-panel" style={{
        padding: "0.75rem 1.15rem",
        minWidth: "210px",
        background: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
          <span style={{
            fontSize: "0.72rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontWeight: "700",
            letterSpacing: "0.05em"
          }}>
            AI COVERAGE RATE
          </span>
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "var(--risk-low)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
          <span style={{
            fontSize: "1.85rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            lineHeight: 1
          }}>
            {ai?.coveragePct || 100}%
          </span>
          <span style={{
            fontSize: "0.68rem",
            background: "var(--risk-low-bg)",
            color: "var(--risk-low)",
            border: "1px solid var(--risk-low)",
            padding: "0.15rem 0.45rem",
            borderRadius: "12px",
            fontWeight: "700",
            fontFamily: "var(--font-mono)"
          }}>
            +{improvement?.coverageBoost || 60}% VS BASE
          </span>
        </div>
      </div>

      {/* Card 2: AVG DISPATCH */}
      <div className="glass-panel" style={{
        padding: "0.75rem 1.15rem",
        minWidth: "210px",
        background: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
          <span style={{
            fontSize: "0.72rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontWeight: "700",
            letterSpacing: "0.05em"
          }}>
            AVG DISPATCH
          </span>
          <Navigation style={{ width: "16px", height: "16px", color: "var(--accent-cyan)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
          <span style={{
            fontSize: "1.85rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            lineHeight: 1
          }}>
            {ai?.avgDistanceKm || 1.2}<span style={{ fontSize: "1.1rem", fontWeight: "700" }}>km</span>
          </span>
          <span style={{
            fontSize: "0.68rem",
            background: "var(--accent-cyan-bg)",
            color: "var(--accent-cyan)",
            border: "1px solid var(--accent-cyan)",
            padding: "0.15rem 0.45rem",
            borderRadius: "12px",
            fontWeight: "700",
            fontFamily: "var(--font-mono)"
          }}>
            -{improvement?.distanceSavedKm || 1.1} KM SAVED
          </span>
        </div>
      </div>

      {/* Card 3: RISK HOTSPOTS */}
      <div className="glass-panel" style={{
        padding: "0.75rem 1.15rem",
        minWidth: "210px",
        background: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
          <span style={{
            fontSize: "0.72rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontWeight: "700",
            letterSpacing: "0.05em"
          }}>
            RISK HOTSPOTS
          </span>
          <AlertCircle style={{ width: "16px", height: "16px", color: "var(--risk-high)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
          <span style={{
            fontSize: "1.85rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            lineHeight: 1
          }}>
            {totalHighRisk || 10}
          </span>
          <span style={{
            fontSize: "0.68rem",
            background: "var(--risk-high-bg)",
            color: "var(--risk-high)",
            border: "1px solid var(--risk-high)",
            padding: "0.15rem 0.45rem",
            borderRadius: "12px",
            fontWeight: "700",
            fontFamily: "var(--font-mono)"
          }}>
            {unmannedHotspotsCount} UNMANNED
          </span>
        </div>
      </div>

      {/* Baseline vs AI Comparison Trigger */}
      <button
        onClick={onOpenComparison}
        style={{
          background: "var(--accent-cyan-bg)",
          border: "1px solid var(--accent-cyan)",
          color: "var(--accent-cyan)",
          borderRadius: "8px",
          padding: "0.6rem 0.85rem",
          cursor: "pointer",
          fontFamily: "var(--font-heading)",
          fontSize: "0.75rem",
          fontWeight: "700",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          backdropFilter: "blur(10px)",
          transition: "all 0.2s ease"
        }}
      >
        <span>VS BASELINE REPORT</span>
      </button>
    </div>
  );
}
