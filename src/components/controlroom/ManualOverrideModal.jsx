import React, { useState } from "react";
import { X, UserCheck, Shield, AlertCircle } from "lucide-react";

export default function ManualOverrideModal({ junction, officers, overrides, onSaveOverride, onRemoveOverride, onClose }) {
  if (!junction) return null;

  const currentOverride = overrides[junction.id];
  const [selectedOfficerId, setSelectedOfficerId] = useState(currentOverride ? currentOverride.officerId : officers[0]?.id || "");
  const [reason, setReason] = useState(currentOverride ? currentOverride.reason : "High priority VIP movement / Manual intervention request");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOfficerId) return;
    onSaveOverride(junction.id, selectedOfficerId, reason);
    onClose();
  };

  const handleRemove = () => {
    onRemoveOverride(junction.id);
    onClose();
  };

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
        maxWidth: "520px",
        backgroundColor: "#111827",
        border: "1px solid #374151",
        borderRadius: "0.75rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        padding: "1.5rem"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: "#F59E0B", fontWeight: "700", textTransform: "uppercase" }}>
              CONTROL ROOM MANUAL OVERRIDE (PRD C8)
            </span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#F9FAFB", margin: 0 }}>
              Manual Officer Reassignment
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#9CA3AF", margin: "0.1rem 0 0 0" }}>
              Target Location: <strong style={{ color: "#FFF" }}>{junction.name}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer" }}>
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Select Officer Dropdown */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#D1D5DB", display: "block", marginBottom: "0.35rem" }}>
              Select Police Officer to Assign:
            </label>
            <select
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.375rem",
                background: "#1F2937",
                border: "1px solid #4B5563",
                color: "#F9FAFB",
                fontSize: "0.85rem"
              }}
            >
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  👮 {officer.name} ({officer.rank}) - {officer.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Override Reason Input */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#D1D5DB", display: "block", marginBottom: "0.35rem" }}>
              Supervisor Override Reason (Logged):
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="e.g. Special VIP convoy security or local market congestion request"
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.375rem",
                background: "#1F2937",
                border: "1px solid #4B5563",
                color: "#F9FAFB",
                fontSize: "0.85rem"
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid #374151" }}>
            {currentOverride ? (
              <button type="button" onClick={handleRemove} className="btn-secondary" style={{ color: "#EF4444" }}>
                Remove Override
              </button>
            ) : <div />}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <UserCheck style={{ width: "15px", height: "15px" }} />
                Save Manual Override
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
