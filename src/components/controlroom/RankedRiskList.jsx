import React, { useState } from "react";
import { Eye, ShieldAlert, Sliders, MapPin, UserCheck, AlertTriangle } from "lucide-react";

export default function RankedRiskList({
  junctionsWithRisk,
  aiAssignments,
  officers,
  simulatedIncident,
  onSelectJunction,
  onOpenOverride,
  onTriggerIncident
}) {
  const [filterLevel, setFilterLevel] = useState("ALL"); // ALL, HIGH, MEDIUM, LOW

  // Sort descending by risk score
  const sortedJunctions = [...junctionsWithRisk].sort((a, b) => b.risk.score - a.risk.score);

  const filtered = sortedJunctions.filter((j) => {
    if (filterLevel === "ALL") return true;
    return j.risk.level === filterLevel;
  });

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#111827",
      borderLeft: "1px solid #1F2937"
    }}>
      {/* List Header & Filters */}
      <div style={{
        padding: "0.85rem 1rem",
        borderBottom: "1px solid #1F2937",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#F9FAFB", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sliders style={{ width: "16px", height: "16px", color: "#3B82F6" }} />
            Ranked Nagpur Risk Locations
          </h3>
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF", fontWeight: "600" }}>
            {filtered.length} Junctions
          </span>
        </div>

        {/* Filter Chips */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              style={{
                padding: "0.25rem 0.6rem",
                borderRadius: "0.25rem",
                border: "none",
                fontSize: "0.7rem",
                fontWeight: "700",
                cursor: "pointer",
                background: filterLevel === level ? "#3B82F6" : "#1F2937",
                color: filterLevel === level ? "#FFF" : "#9CA3AF"
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Junction Cards Scroll Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {filtered.map((junction, index) => {
          const { id, name, zone, landmark, risk } = junction;
          const assigned = aiAssignments.assignments.find((a) => a.junctionId === id);
          const isSimulated = simulatedIncident && simulatedIncident.junctionId === id;
          const isCoverageGap = simulatedIncident && simulatedIncident.uncoveredJunctionId === id;

          return (
            <div
              key={id}
              className="glass-card"
              style={{
                padding: "0.75rem",
                borderLeft: `4px solid ${risk.color}`,
                borderColor: isSimulated ? "#EF4444" : isCoverageGap ? "#F59E0B" : "rgba(255, 255, 255, 0.08)",
                background: isSimulated
                  ? "rgba(239, 68, 68, 0.12)"
                  : isCoverageGap
                  ? "rgba(245, 158, 11, 0.12)"
                  : "rgba(31, 41, 55, 0.75)",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                transition: "all 0.15s ease"
              }}
            >
              {/* Card Top Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#60A5FA", fontFamily: "var(--font-mono)" }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#F9FAFB" }}>
                      {name}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#9CA3AF", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <MapPin style={{ width: "11px", height: "11px" }} />
                    {zone}
                  </span>
                </div>

                {/* Score Pill */}
                <div style={{ textAlign: "right" }}>
                  <span className={`badge-${risk.level.toLowerCase()}`} style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}>
                    {risk.score}/100
                  </span>
                </div>
              </div>

              {/* Coverage Gap or Incident Tag */}
              {isCoverageGap && (
                <div style={{
                  background: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid #D97706",
                  color: "#FDE68A",
                  fontSize: "0.68rem",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "0.2rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}>
                  <AlertTriangle style={{ width: "12px", height: "12px" }} />
                  UNMANNED COVERAGE GAP (OFFICER REDEPLOYED)
                </div>
              )}

              {/* Active Officer Information */}
              <div style={{
                fontSize: "0.74rem",
                color: "#D1D5DB",
                background: "rgba(15, 23, 42, 0.6)",
                padding: "0.35rem 0.5rem",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                {assigned ? (
                  <span style={{ color: "#60A5FA", fontWeight: "600" }}>
                    👮 {assigned.officerName} ({assigned.distanceKm} km)
                  </span>
                ) : (
                  <span style={{ color: "#FCA5A5", fontWeight: "600" }}>
                    ⚠️ No Police Stationed
                  </span>
                )}
                <span style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>
                  {risk.activeComplaintCount} complaints
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.2rem" }}>
                <button
                  onClick={() => onSelectJunction(junction)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: "0.25rem 0.5rem", fontSize: "0.7rem", justifyContent: "center" }}
                >
                  <Eye style={{ width: "12px", height: "12px" }} />
                  Explain Score
                </button>
                <button
                  onClick={() => onOpenOverride(junction)}
                  className="btn-secondary"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
                  title="Manual Override Assignment"
                >
                  <UserCheck style={{ width: "12px", height: "12px" }} />
                  Reassign
                </button>
                <button
                  onClick={() => onTriggerIncident(id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#FCA5A5",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.7rem",
                    cursor: "pointer"
                  }}
                  title="Simulate Emergency Incident"
                >
                  <ShieldAlert style={{ width: "12px", height: "12px" }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
