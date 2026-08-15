import React from "react";
import { Shield, AlertCircle, Cpu, Clock, CheckCircle2, TrendingUp, Navigation, AlertTriangle } from "lucide-react";

export default function DashboardHeader({ metrics, activeZone, simulatedIncident, unmannedHotspotsCount, onOpenComparison }) {
  const { totalHighRisk, ai, baseline, improvement } = metrics;

  return (
    <div style={{
      background: "#111827",
      borderBottom: "1px solid #1F2937",
      padding: "0.75rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    }}>
      {/* Alert banner if unmanned high risk hotspots exist */}
      {unmannedHotspotsCount > 0 && !simulatedIncident && (
        <div style={{
          background: "linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <AlertTriangle style={{ color: "#EF4444", width: "18px", height: "18px" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#FCA5A5" }}>
              UNMANNED HIGH RISK HOTSPOT ALERT:
            </span>
            <span style={{ fontSize: "0.82rem", color: "#F3F4F6" }}>
              {unmannedHotspotsCount} high-risk Nagpur junction(s) currently lack stationed police officers.
            </span>
          </div>
          <button
            onClick={onOpenComparison}
            style={{
              background: "#EF4444",
              color: "#FFF",
              border: "none",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.6rem",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Review AI Reallocation
          </button>
        </div>
      )}

      {/* KPI Stats Ribbon */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0.75rem"
      }}>
        {/* Coverage Card */}
        <div className="glass-card" style={{ padding: "0.75rem 1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: "600" }}>AI COVERAGE RATE</span>
            <CheckCircle2 style={{ width: "15px", height: "15px", color: "#10B981" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#10B981" }}>
              {ai.coveragePct}%
            </span>
            <span style={{ fontSize: "0.72rem", color: "#6EE7B7", fontWeight: "600" }}>
              +{improvement.coverageBoost}% vs Baseline
            </span>
          </div>
          <p style={{ fontSize: "0.68rem", color: "#6B7280", margin: 0 }}>
            High-risk zones covered by active patrol
          </p>
        </div>

        {/* Avg Response Distance */}
        <div className="glass-card" style={{ padding: "0.75rem 1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: "600" }}>AVG RESPONSE DISPATCH</span>
            <Navigation style={{ width: "15px", height: "15px", color: "#3B82F6" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#60A5FA" }}>
              {ai.avgDistanceKm} km
            </span>
            <span style={{ fontSize: "0.72rem", color: "#93C5FD", fontWeight: "600" }}>
              -{improvement.distanceSavedKm} km saved
            </span>
          </div>
          <p style={{ fontSize: "0.68rem", color: "#6B7280", margin: 0 }}>
            Proximity optimized dispatch radius
          </p>
        </div>

        {/* High Risk Hotspots */}
        <div className="glass-card" style={{ padding: "0.75rem 1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", fontWeight: "600" }}>HIGH RISK HOTSPOTS</span>
            <AlertCircle style={{ width: "15px", height: "15px", color: "#EF4444" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#FCA5A5" }}>
              {totalHighRisk} Locations
            </span>
            <span style={{ fontSize: "0.72rem", color: "#F87171", fontWeight: "600" }}>
              {ai.unmannedHotspots} unmanned
            </span>
          </div>
          <p style={{ fontSize: "0.68rem", color: "#6B7280", margin: 0 }}>
            Nagpur Sitabuldi & West Corridor
          </p>
        </div>

        {/* Baseline vs AI Summary Trigger */}
        <div className="glass-card" style={{
          padding: "0.75rem 1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          cursor: "pointer",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }} onClick={onOpenComparison}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#93C5FD", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <TrendingUp style={{ width: "14px", height: "14px" }} />
              Baseline vs AI Report
            </span>
            <span style={{ fontSize: "0.7rem", background: "#2563EB", color: "#FFF", padding: "0.1rem 0.4rem", borderRadius: "0.2rem", fontWeight: "700" }}>
              VIEW
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#94A3B8", margin: "0.25rem 0 0 0" }}>
            Quantify AI deployment vs static baseline plan
          </p>
        </div>
      </div>
    </div>
  );
}
