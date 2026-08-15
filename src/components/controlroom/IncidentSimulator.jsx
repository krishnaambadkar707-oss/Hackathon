import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, RefreshCcw, MapPin, Zap } from "lucide-react";

export default function IncidentSimulator({
  simulatedIncident,
  junctions,
  officers,
  onTriggerIncident,
  onClearIncident
}) {
  if (!simulatedIncident) {
    return (
      <div style={{
        background: "#1E293B",
        borderBottom: "1px solid #334155",
        padding: "0.6rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap style={{ color: "#F59E0B", width: "16px", height: "16px" }} />
          <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#E2E8F0" }}>
            Live Incident Redeployment Simulator:
          </span>
          <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
            Test dynamic AI police re-allocation when a sudden traffic emergency occurs.
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onTriggerIncident("j2")} // Default Law College Sq
            className="btn-danger"
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
          >
            <AlertTriangle style={{ width: "13px", height: "13px" }} />
            Simulate Law College Sq Collision
          </button>
          <button
            onClick={() => onTriggerIncident("j8")} // Chhatrapati Sq
            className="btn-secondary"
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
          >
            Simulate Chhatrapati Sq Tanker Breakdown
          </button>
        </div>
      </div>
    );
  }

  // Active Incident Banner
  const incidentJunction = junctions.find((j) => j.id === simulatedIncident.junctionId);
  const redeployedOfficer = officers.find((o) => o.id === simulatedIncident.redeployedOfficerId);
  const uncoveredJunction = junctions.find((j) => j.id === simulatedIncident.uncoveredJunctionId);

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)",
      borderBottom: "2px solid #EF4444",
      padding: "0.85rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
      boxShadow: "0 4px 15px rgba(220, 38, 38, 0.2)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{
            background: "#EF4444",
            color: "#FFF",
            fontSize: "0.7rem",
            fontWeight: "800",
            padding: "0.2rem 0.5rem",
            borderRadius: "0.25rem",
            letterSpacing: "0.05em",
            animation: "pulse-red 1.5s infinite"
          }}>
            LIVE INCIDENT TRIGGERED
          </span>
          <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#FFFFFF", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ShieldAlert style={{ color: "#FCA5A5", width: "18px", height: "18px" }} />
            High-Priority Traffic Emergency at {incidentJunction?.name}
          </h3>
        </div>

        <button
          onClick={onClearIncident}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            color: "#FFF",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "0.3rem 0.7rem",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          <RefreshCcw style={{ width: "13px", height: "13px" }} />
          Reset Live Incident
        </button>
      </div>

      {/* Dynamic Redeployment Execution Flow Card */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto 1fr",
        alignItems: "center",
        gap: "0.75rem",
        background: "rgba(15, 23, 42, 0.7)",
        padding: "0.65rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid rgba(239, 68, 68, 0.3)"
      }}>
        {/* Step 1: Officer Dispatched */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ background: "#2563EB", color: "#FFF", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
            👮
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "#93C5FD", fontWeight: "600", display: "block" }}>REDEPLOYED OFFICER</span>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF" }}>{redeployedOfficer?.name}</span>
          </div>
        </div>

        <ArrowRight style={{ color: "#60A5FA", width: "18px", height: "18px" }} />

        {/* Step 2: Destination Incident */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <MapPin style={{ color: "#EF4444", width: "22px", height: "22px" }} />
          <div>
            <span style={{ fontSize: "0.7rem", color: "#FCA5A5", fontWeight: "600", display: "block" }}>NEW DISPATCH POST</span>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF" }}>{incidentJunction?.name}</span>
          </div>
        </div>

        <div style={{ height: "24px", width: "1px", background: "rgba(255, 255, 255, 0.2)" }} />

        {/* Step 3: Coverage Gap Warning */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle style={{ color: "#F59E0B", width: "22px", height: "22px" }} />
          <div>
            <span style={{ fontSize: "0.7rem", color: "#FDE68A", fontWeight: "700", display: "block" }}>
              ⚠️ COVERAGE GAP OPENED
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FDE68A" }}>
              {uncoveredJunction?.name || "Former Post"} is now unmanned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
