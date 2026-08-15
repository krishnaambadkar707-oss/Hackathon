import React, { useState } from "react";
import { X, History, Clock, AlertTriangle, ShieldCheck, FileText, UserCheck, Search, Filter } from "lucide-react";

export default function HistoryDrawer({ complaints, overrides, simulatedIncident, isOpen, onClose }) {
  const [filterType, setFilterType] = useState("ALL"); // ALL, COMPLAINTS, OVERRIDES, INCIDENTS
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Build unified chronological timeline event list
  const timelineEvents = [];

  // 1. Complaints Events
  complaints.forEach((c) => {
    timelineEvents.push({
      id: `ev-comp-${c.id}`,
      type: "COMPLAINT",
      title: `Citizen Report: ${c.categoryLabel}`,
      location: c.junctionName,
      timestamp: c.timestamp,
      detail: c.description,
      status: c.status,
      icon: FileText,
      color: "#3B82F6"
    });
  });

  // 2. Override Events
  Object.keys(overrides).forEach((jId) => {
    const o = overrides[jId];
    timelineEvents.push({
      id: `ev-ov-${jId}`,
      type: "OVERRIDE",
      title: `Supervisor Manual Override`,
      location: `Junction ID: ${jId}`,
      timestamp: o.timestamp || new Date().toISOString(),
      detail: `Reassigned Officer ID: ${o.officerId}. Reason: ${o.reason}`,
      status: "LOGGED",
      icon: UserCheck,
      color: "#F59E0B"
    });
  });

  // 3. Incident Event (if active)
  if (simulatedIncident) {
    timelineEvents.push({
      id: `ev-inc-${simulatedIncident.junctionId}`,
      type: "INCIDENT",
      title: `Emergency Incident Triggered`,
      location: simulatedIncident.junctionName,
      timestamp: simulatedIncident.timestamp || new Date().toISOString(),
      detail: `Officer ${simulatedIncident.redeployedOfficerId} dynamically redeployed. Coverage gap at former post.`,
      status: "ACTIVE",
      icon: AlertTriangle,
      color: "#EF4444"
    });
  }

  // Sort descending by timestamp
  timelineEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filter events
  const filteredEvents = timelineEvents.filter((ev) => {
    if (filterType !== "ALL" && ev.type !== filterType) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.detail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 7, 18, 0.75)",
      backdropFilter: "blur(6px)",
      zIndex: 2000,
      display: "flex",
      justifyContent: "flex-end"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        height: "100%",
        background: "var(--bg-panel)",
        borderLeft: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-10px 0 25px rgba(0,0,0,0.5)"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History style={{ width: "20px", height: "20px", color: "#3B82F6" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              System History & Activity Log
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            {["ALL", "COMPLAINT", "OVERRIDE", "INCIDENT"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: "0.25rem 0.6rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: filterType === type ? "#3B82F6" : "var(--bg-hover)",
                  color: filterType === type ? "#FFF" : "var(--text-secondary)"
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history log entries..."
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem 0.45rem 2rem",
                borderRadius: "0.375rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "0.8rem"
              }}
            />
          </div>
        </div>

        {/* Timeline Events Scroll List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>
              No historical log entries match your filter.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const Icon = ev.icon;
              return (
                <div key={ev.id} style={{ display: "flex", gap: "0.85rem", position: "relative" }}>
                  {/* Timeline Node Icon */}
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: `${ev.color}20`,
                    border: `1.5px solid ${ev.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ev.color,
                    flexShrink: 0
                  }}>
                    <Icon style={{ width: "16px", height: "16px" }} />
                  </div>

                  {/* Event Details Card */}
                  <div className="glass-card" style={{ flex: 1, padding: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-primary)" }}>
                        {ev.title}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.75rem", color: "#3B82F6", fontWeight: "600", margin: "0 0 0.25rem 0" }}>
                      📍 {ev.location}
                    </p>

                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.4" }}>
                      {ev.detail}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
