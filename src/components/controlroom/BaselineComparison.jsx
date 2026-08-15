import React from "react";
import { X, TrendingUp, ShieldCheck, AlertOctagon, Navigation, ArrowUpRight } from "lucide-react";

export default function BaselineComparison({ metrics, onClose }) {
  const { totalHighRisk, ai, baseline, improvement } = metrics;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 7, 18, 0.8)",
      backdropFilter: "blur(6px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "680px",
        backgroundColor: "#111827",
        border: "1px solid #374151",
        borderRadius: "0.75rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        padding: "1.5rem"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              DEMO HIGHLIGHT METRIC #4 (PRD C9)
            </span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#F9FAFB", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <TrendingUp style={{ color: "#10B981", width: "22px", height: "22px" }} />
              Static Baseline vs AI Deployment Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer" }}
          >
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Side-by-Side Cards Comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
          {/* Static Baseline Plan */}
          <div style={{
            background: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            padding: "1rem"
          }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Traditional Baseline Plan
            </h3>

            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF", display: "block" }}>HIGH-RISK COVERAGE %</span>
              <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#FCA5A5" }}>
                {baseline.coveragePct}%
              </span>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF", display: "block" }}>AVG OFFICER DISPATCH DISTANCE</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#D1D5DB" }}>
                {baseline.avgDistanceKm} km
              </span>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF", display: "block" }}>UNMANNED HIGH-RISK HOTSPOTS</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#EF4444" }}>
                {baseline.unmannedHotspots} Gaps
              </span>
            </div>
          </div>

          {/* AI Recommended Plan */}
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)",
            border: "1px solid #10B981",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: "0 0 15px rgba(16, 185, 129, 0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#6EE7B7", textTransform: "uppercase", margin: 0 }}>
                AI Greedy Allocation Engine
              </h3>
              <span style={{ background: "#10B981", color: "#FFF", fontSize: "0.65rem", fontWeight: "800", padding: "0.1rem 0.4rem", borderRadius: "0.2rem" }}>
                RECOMMENDED
              </span>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#A7F3D0", display: "block" }}>HIGH-RISK COVERAGE %</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10B981" }}>
                  {ai.coveragePct}%
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#34D399" }}>
                  (+{improvement.coverageBoost}% boost)
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#A7F3D0", display: "block" }}>AVG OFFICER DISPATCH DISTANCE</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#60A5FA" }}>
                  {ai.avgDistanceKm} km
                </span>
                <span style={{ fontSize: "0.75rem", color: "#93C5FD" }}>
                  ({improvement.distanceSavedKm} km saved)
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "#A7F3D0", display: "block" }}>UNMANNED HIGH-RISK HOTSPOTS</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#34D399" }}>
                {ai.unmannedHotspots} Gaps ({improvement.hotspotsPrevented} prevented)
              </span>
            </div>
          </div>
        </div>

        {/* Closing Impact Stat Banner */}
        <div style={{
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <ShieldCheck style={{ width: "24px", height: "24px", color: "#10B981" }} />
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F9FAFB", margin: 0 }}>
              Nagpur Traffic Division Demo Closing Headline Impact
            </h4>
            <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0 }}>
              AI greedy allocation elevates high-risk junction police coverage by <strong style={{ color: "#10B981" }}>+{improvement.coverageBoost}%</strong> while reducing average officer dispatch transit distance by <strong style={{ color: "#60A5FA" }}>{improvement.distanceSavedKm} km</strong>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: "0.5rem 1.2rem" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
