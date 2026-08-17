import React, { useState } from "react";
import { Sliders, MapPin, Eye, UserCheck, Shield } from "lucide-react";

export default function RankedRiskList({
  junctionsWithRisk,
  aiAssignments,
  officers,
  simulatedIncident,
  onSelectJunction,
  onOpenOverride,
  onTriggerIncident
}) {
  const [filterLevel, setFilterLevel] = useState("ALL");

  const sortedJunctions = [...junctionsWithRisk].sort((a, b) => b.risk.score - a.risk.score);

  const filtered = sortedJunctions.filter((j) => {
    if (filterLevel === "ALL") return true;
    if (filterLevel === "HIGH") return j.risk.level === "HIGH";
    if (filterLevel === "MED") return j.risk.level === "MEDIUM";
    if (filterLevel === "LOW") return j.risk.level === "LOW";
    return true;
  });

  return (
    <aside style={{
      width: "360px",
      height: "100%",
      background: "var(--bg-panel)",
      backdropFilter: "var(--backdrop-blur)",
      WebkitBackdropFilter: "var(--backdrop-blur)",
      borderLeft: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      zIndex: 950,
      boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)"
    }}>
      {/* Panel Header */}
      <div style={{
        padding: "1rem",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: "900",
            color: "var(--text-primary)",
            fontFamily: "var(--font-tech)",
            letterSpacing: "0.06em",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Sliders style={{ width: "18px", height: "18px", color: "var(--accent-cyan)" }} />
            RANKED RISKS
          </h3>
          <span style={{
            background: "var(--accent-cyan-bg)",
            color: "var(--accent-cyan)",
            border: "1px solid var(--accent-cyan)",
            fontSize: "0.68rem",
            fontWeight: "700",
            fontFamily: "var(--font-mono)",
            padding: "0.15rem 0.55rem",
            borderRadius: "12px"
          }}>
            {junctionsWithRisk.length} JUNCTIONS
          </span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["ALL", "HIGH", "MED", "LOW"].map((level) => {
            const isActive = filterLevel === level;
            return (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                style={{
                  flex: 1,
                  padding: "0.3rem 0.5rem",
                  borderRadius: "4px",
                  border: isActive ? "1px solid var(--accent-cyan)" : "1px solid var(--border-color)",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  background: isActive ? "var(--accent-cyan)" : "var(--bg-card)",
                  color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                  transition: "all 0.15s ease",
                  textTransform: "uppercase"
                }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List Container */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "0.85rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem"
      }}>
        {filtered.map((junction, index) => {
          const { id, name, zone, landmark, risk } = junction;
          const assigned = aiAssignments.assignments.find((a) => a.junctionId === id);
          const isSimulated = simulatedIncident && simulatedIncident.junctionId === id;
          const isCoverageGap = simulatedIncident && simulatedIncident.uncoveredJunctionId === id;

          return (
            <div
              key={id}
              className="glass-card"
              onClick={() => onSelectJunction(junction)}
              style={{
                padding: "0.85rem",
                borderRadius: "8px",
                border: isSimulated
                  ? "1px solid var(--risk-high)"
                  : isCoverageGap
                  ? "1px solid var(--risk-med)"
                  : "1px solid var(--border-color)",
                background: isSimulated
                  ? "var(--risk-high-bg)"
                  : isCoverageGap
                  ? "var(--risk-med-bg)"
                  : "var(--bg-card)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                cursor: "pointer"
              }}
            >
              {/* Card Header: Rank #, Title & Score */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{
                      fontSize: "0.85rem",
                      fontWeight: "900",
                      color: "var(--accent-cyan)",
                      fontFamily: "var(--font-mono)"
                    }}>
                      #{index + 1}
                    </span>
                    <h4 style={{
                      fontSize: "0.95rem",
                      fontWeight: "800",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-heading)",
                      margin: 0
                    }}>
                      {name}
                    </h4>
                  </div>
                  <span style={{
                    fontSize: "0.7rem",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    marginTop: "0.15rem"
                  }}>
                    <MapPin style={{ width: "11px", height: "11px", color: "var(--accent-cyan)" }} />
                    {zone || landmark}
                  </span>
                </div>

                {/* Score Pill */}
                <div style={{
                  background: risk.level === "HIGH" ? "var(--risk-high-bg)" : risk.level === "MEDIUM" ? "var(--risk-med-bg)" : "var(--risk-low-bg)",
                  border: `1px solid ${risk.color}`,
                  color: risk.color,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "800",
                  fontSize: "0.85rem"
                }}>
                  {risk.score}/100
                </div>
              </div>

              {/* Officer Details Pill */}
              <div style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-color)",
                padding: "0.4rem 0.6rem",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)"
              }}>
                {assigned ? (
                  <span style={{ color: "var(--accent-cyan)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Shield style={{ width: "13px", height: "13px", color: "var(--accent-cyan)" }} />
                    {assigned.officerName} ({assigned.distanceKm}km)
                  </span>
                ) : (
                  <span style={{ color: "var(--risk-high)", fontWeight: "700" }}>
                    ⚠️ 0 Stationed Officers
                  </span>
                )}
                <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>
                  {risk.activeComplaintCount} Reports
                </span>
              </div>

              {/* Action Buttons: EXPLAIN & REASSIGN */}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectJunction(junction);
                  }}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "0.35rem 0.5rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em"
                  }}
                >
                  <Eye style={{ width: "13px", height: "13px" }} />
                  EXPLAIN
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenOverride(junction);
                  }}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "0.35rem 0.5rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em"
                  }}
                >
                  <UserCheck style={{ width: "13px", height: "13px" }} />
                  REASSIGN
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
