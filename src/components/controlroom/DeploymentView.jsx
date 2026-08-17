import React from "react";
import { Shield, PhoneCall, Car } from "lucide-react";

export default function DeploymentView({ officers = [], junctionsWithRisk = [], aiAssignments = {}, onOpenOverride }) {
  const assignments = aiAssignments.assignments || [];

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
            POLICE RESOURCE DEPLOYMENT HUB
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Nagpur Traffic Police Patrol Units & Real-Time Roster Assignments.
          </p>
        </div>
        <span style={{
          background: "var(--risk-low-bg)",
          color: "var(--risk-low)",
          border: "1px solid var(--risk-low)",
          fontSize: "0.75rem",
          fontWeight: "700",
          fontFamily: "var(--font-mono)",
          padding: "0.3rem 0.75rem",
          borderRadius: "20px"
        }}>
          {officers.length} OFFICERS ACTIVE
        </span>
      </div>

      {/* Roster Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1rem"
      }}>
        {officers.map((officer) => {
          const assignment = assignments.find((a) => a.officerId === officer.id);
          const junction = assignment ? junctionsWithRisk.find((j) => j.id === assignment.junctionId) : null;

          return (
            <div key={officer.id} className="glass-panel" style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--accent-cyan-bg)",
                    border: "1px solid var(--accent-cyan)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-cyan)"
                  }}>
                    <Shield style={{ width: "20px", height: "20px" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                      {officer.name}
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                      Badge #{officer.badgeNumber} | {officer.unit}
                    </span>
                  </div>
                </div>

                <span style={{
                  background: officer.status === "ON_DUTY" ? "var(--risk-low-bg)" : "var(--risk-med-bg)",
                  color: officer.status === "ON_DUTY" ? "var(--risk-low)" : "var(--risk-med)",
                  border: `1px solid ${officer.status === "ON_DUTY" ? "var(--risk-low)" : "var(--risk-med)"}`,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)"
                }}>
                  {officer.status}
                </span>
              </div>

              {/* Vehicle & Contact Info */}
              <div style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-color)",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.78rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                fontFamily: "var(--font-mono)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Car style={{ width: "13px", height: "13px", color: "var(--accent-cyan)" }} /> Vehicle:
                  </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "700" }}>{officer.vehicle}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <PhoneCall style={{ width: "13px", height: "13px", color: "var(--accent-cyan)" }} /> Contact:
                  </span>
                  <a href={`tel:${officer.phone}`} style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: "700" }}>
                    {officer.phone}
                  </a>
                </div>
              </div>

              {/* Active AI Assignment */}
              <div style={{
                background: junction ? "var(--accent-cyan-bg)" : "var(--risk-high-bg)",
                border: junction ? "1px solid var(--accent-cyan)" : "1px solid var(--risk-high)",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px"
              }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block" }}>
                  CURRENT STATION:
                </span>
                {junction ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.2rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--accent-cyan)", fontFamily: "var(--font-heading)" }}>
                      {junction.name}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                      ({assignment.distanceKm} km)
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "var(--risk-high)", fontWeight: "700" }}>
                    Unassigned / In Transit
                  </span>
                )}
              </div>

              {junction && (
                <button
                  onClick={() => onOpenOverride(junction)}
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.2rem" }}
                >
                  REASSIGN OFFICER
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
