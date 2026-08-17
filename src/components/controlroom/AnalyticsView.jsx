import React from "react";
import { ShieldCheck, Clock, Navigation } from "lucide-react";

export default function AnalyticsView({ metrics, junctionsWithRisk, aiAssignments }) {
  const { totalHighRisk, ai = {}, baseline = {}, improvement = {} } = metrics || {};

  return (
    <div style={{
      width: "100%",
      height: "100%",
      padding: "1.5rem",
      overflowY: "auto",
      background: "var(--bg-main)",
      color: "var(--text-primary)",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            letterSpacing: "0.06em",
            margin: 0
          }}>
            ANALYTICS & PERFORMANCE METRICS
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Real-time evaluation of AI risk mitigation vs legacy static police allocation in Nagpur.
          </p>
        </div>
        <span style={{
          background: "var(--accent-cyan-bg)",
          color: "var(--accent-cyan)",
          border: "1px solid var(--accent-cyan)",
          fontSize: "0.75rem",
          fontWeight: "700",
          fontFamily: "var(--font-mono)",
          padding: "0.3rem 0.75rem",
          borderRadius: "20px"
        }}>
          LIVE ANALYTICS ENGINE
        </span>
      </div>

      {/* Metric Comparison Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem"
      }}>
        {/* Coverage Boost */}
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              HIGH RISK COVERAGE
            </span>
            <ShieldCheck style={{ width: "20px", height: "20px", color: "var(--risk-low)" }} />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "var(--risk-low)", fontFamily: "var(--font-tech)" }}>
            {ai.coveragePct || 100}%
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.4rem 0 0 0" }}>
            vs Baseline ({baseline.coveragePct || 40}%). <strong style={{ color: "var(--risk-low)" }}>+{improvement.coverageBoost || 60}% Boost</strong>
          </p>
        </div>

        {/* Avg Response Distance */}
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              AVG DISPATCH RADIUS
            </span>
            <Navigation style={{ width: "20px", height: "20px", color: "var(--accent-cyan)" }} />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "var(--accent-cyan)", fontFamily: "var(--font-tech)" }}>
            {ai.avgDistanceKm || 1.2} km
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.4rem 0 0 0" }}>
            vs Baseline ({baseline.avgDistanceKm || 2.3} km). <strong style={{ color: "var(--accent-cyan)" }}>-{improvement.distanceSavedKm || 1.1} km Saved</strong>
          </p>
        </div>

        {/* Response ETA */}
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              ESTIMATED RESPONSE TIME
            </span>
            <Clock style={{ width: "20px", height: "20px", color: "var(--risk-med)" }} />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "var(--risk-med)", fontFamily: "var(--font-tech)" }}>
            {ai.avgEstResponseTimeMin || 3.6} min
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.4rem 0 0 0" }}>
            vs Baseline ({baseline.avgEstResponseTimeMin || 6.9} min). <strong style={{ color: "var(--risk-med)" }}>-{improvement.timeSavedMin || 3.3} min Faster</strong>
          </p>
        </div>
      </div>

      {/* Detailed Risk Score Distribution Table */}
      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        <h3 style={{
          fontSize: "1.1rem",
          fontWeight: "800",
          color: "var(--text-primary)",
          fontFamily: "var(--font-tech)",
          marginBottom: "1rem"
        }}>
          NAGPUR JUNCTIONS RISK SCORE BREAKDOWN
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <th style={{ padding: "0.65rem" }}>RANK</th>
                <th style={{ padding: "0.65rem" }}>JUNCTION</th>
                <th style={{ padding: "0.65rem" }}>ZONE / CORRIDOR</th>
                <th style={{ padding: "0.65rem" }}>RISK SCORE</th>
                <th style={{ padding: "0.65rem" }}>LEVEL</th>
                <th style={{ padding: "0.65rem" }}>ASSIGNED OFFICER</th>
              </tr>
            </thead>
            <tbody>
              {junctionsWithRisk.slice().sort((a,b) => b.risk.score - a.risk.score).map((j, idx) => {
                const assigned = aiAssignments.assignments?.find((a) => a.junctionId === j.id);
                return (
                  <tr key={j.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.65rem", fontFamily: "var(--font-mono)", fontWeight: "700", color: "var(--accent-cyan)" }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: "0.65rem", fontWeight: "800", color: "var(--text-primary)" }}>
                      {j.name}
                    </td>
                    <td style={{ padding: "0.65rem", color: "var(--text-secondary)" }}>
                      {j.zone || j.landmark}
                    </td>
                    <td style={{ padding: "0.65rem", fontFamily: "var(--font-mono)", fontWeight: "800", color: j.risk.color }}>
                      {j.risk.score}/100
                    </td>
                    <td style={{ padding: "0.65rem" }}>
                      <span className={`badge-${j.risk.level.toLowerCase()}`}>
                        {j.risk.level}
                      </span>
                    </td>
                    <td style={{ padding: "0.65rem", color: assigned ? "var(--accent-cyan)" : "var(--risk-high)", fontWeight: "700" }}>
                      {assigned ? `👮 ${assigned.officerName} (${assigned.distanceKm}km)` : "⚠️ Unmanned"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
