import React, { useState } from "react";
import { MapPin, AlertOctagon, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

export default function IncidentLogsView({ complaints = [], simulatedIncident = null, overrides = {}, junctionsWithRisk = [] }) {
  const [filterCategory, setFilterCategory] = useState("ALL");

  const formatLogTime = (ts) => {
    if (!ts) return "Recent";
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return String(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Recent";
    }
  };

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const safeJunctions = Array.isArray(junctionsWithRisk) ? junctionsWithRisk : [];

  // Convert overrides object {} to array safely
  const overrideEntries = Array.isArray(overrides)
    ? overrides
    : Object.keys(overrides || {}).map((jId) => ({
        junctionId: jId,
        ...(overrides[jId] || {})
      }));

  const combinedLogs = [
    ...(simulatedIncident ? [{
      id: `sim-${simulatedIncident.timestamp || Date.now()}`,
      type: "EMERGENCY_SIMULATION",
      title: "🚨 Emergency Collision Incident",
      junctionName: simulatedIncident.junctionName || "Nagpur Intersection",
      time: formatLogTime(simulatedIncident.timestamp),
      severity: "CRITICAL",
      details: `Officer ${simulatedIncident.redeployedOfficerId || "Patrol Unit"} redeployed dynamically.`
    }] : []),
    ...safeComplaints.map((c) => ({
      id: c.id || `c-${Math.random()}`,
      type: "CITIZEN_REPORT",
      title: c.categoryLabel || c.category || "Citizen Traffic Report",
      junctionName: c.junctionName || "Nagpur Sector",
      time: formatLogTime(c.timestamp),
      severity: c.category === "ACCIDENT" ? "HIGH" : "MEDIUM",
      details: `${c.description || "Traffic issue logged"} (Reported by ${c.citizenName || "Citizen"})`
    })),
    ...overrideEntries.map((o) => {
      const j = safeJunctions.find((j) => j.id === o.junctionId);
      return {
        id: `ovr-${o.junctionId}`,
        type: "SUPERVISOR_OVERRIDE",
        title: "Supervisor Manual Reassignment",
        junctionName: j ? j.name : (o.junctionId || "Junction"),
        time: formatLogTime(o.timestamp),
        severity: "INFO",
        details: `Override Reason: ${o.reason || "Manual Supervisor Command"}`
      };
    })
  ];

  const filteredLogs = combinedLogs.filter((log) => {
    if (filterCategory === "ALL") return true;
    if (filterCategory === "EMERGENCY") return log.type === "EMERGENCY_SIMULATION" || log.severity === "CRITICAL";
    if (filterCategory === "CITIZEN") return log.type === "CITIZEN_REPORT";
    if (filterCategory === "OVERRIDE") return log.type === "SUPERVISOR_OVERRIDE";
    return true;
  });

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
            INCIDENT LOGS & EVENT TIMELINE
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0.2rem 0 0 0" }}>
            Real-time audit log of traffic incidents, hazards, citizen reports, and officer redeployments ({filteredLogs.length} events logged).
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["ALL", "EMERGENCY", "CITIZEN", "OVERRIDE"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "4px",
                border: filterCategory === cat ? "1px solid var(--accent-cyan)" : "1px solid var(--border-color)",
                background: filterCategory === cat ? "var(--accent-cyan)" : "var(--bg-card)",
                color: filterCategory === cat ? "#FFFFFF" : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
            No incident logs found for this filter.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  <th style={{ padding: "0.75rem" }}>TIME</th>
                  <th style={{ padding: "0.75rem" }}>EVENT TYPE</th>
                  <th style={{ padding: "0.75rem" }}>LOCATION</th>
                  <th style={{ padding: "0.75rem" }}>SEVERITY</th>
                  <th style={{ padding: "0.75rem" }}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", fontWeight: "700" }}>
                      {log.time}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: "800", color: "var(--text-primary)" }}>
                      {log.title}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin style={{ width: "13px", height: "13px", color: "var(--accent-cyan)" }} />
                        {log.junctionName}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge-${log.severity === "CRITICAL" || log.severity === "HIGH" ? "high" : log.severity === "MEDIUM" ? "med" : "low"}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
