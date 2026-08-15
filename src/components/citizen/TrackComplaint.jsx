import React, { useState } from "react";
import { Search, CheckCircle, Clock, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "../common/LanguageSelector";

export default function TrackComplaint({ complaints, currentLang, onBack }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;
  const [searchId, setSearchId] = useState("NGP-TRF-2026-8942");
  const [selectedComplaint, setSelectedComplaint] = useState(complaints[0] || null);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = complaints.find(
      (c) => c.id.toLowerCase().trim() === searchId.toLowerCase().trim()
    );
    if (found) {
      setSelectedComplaint(found);
    } else {
      alert(`No complaint found with ID: ${searchId}`);
    }
  };

  const getStepStatus = (stepName) => {
    if (!selectedComplaint) return "WAITING";
    const { status } = selectedComplaint;
    if (status === "RESOLVED") return "COMPLETED";
    if (status === "ASSIGNED") {
      if (stepName === "RECEIVED" || stepName === "ASSIGNED") return "COMPLETED";
      return "WAITING";
    }
    if (status === "RECEIVED") {
      if (stepName === "RECEIVED") return "COMPLETED";
      return "WAITING";
    }
    return "WAITING";
  };

  return (
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Search Input */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder={t.enterTrackingId}
          required
          style={{
            flex: 1,
            padding: "0.65rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #CBD5E1",
            background: "#FFFFFF",
            color: "#0F172A",
            fontSize: "0.85rem",
            fontFamily: "var(--font-mono)"
          }}
        />
        <button type="submit" className="btn-primary" style={{ padding: "0.65rem 1rem" }}>
          <Search style={{ width: "16px", height: "16px" }} />
        </button>
      </form>

      {/* Complaint Detail Card */}
      {selectedComplaint && (
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}>
          {/* Header */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#1E40AF", fontFamily: "var(--font-mono)" }}>
                ID: {selectedComplaint.id}
              </span>
              <span style={{
                background: selectedComplaint.status === "RESOLVED" ? "#D1FAE5" : selectedComplaint.status === "ASSIGNED" ? "#DBEAFE" : "#FEF3C7",
                color: selectedComplaint.status === "RESOLVED" ? "#065F46" : selectedComplaint.status === "ASSIGNED" ? "#1E40AF" : "#92400E",
                fontSize: "0.72rem",
                fontWeight: "800",
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                {selectedComplaint.status}
              </span>
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0F172A", margin: "0.2rem 0" }}>
              {selectedComplaint.categoryLabel}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <MapPin style={{ width: "13px", height: "13px", color: "#3B82F6" }} />
              {selectedComplaint.junctionName}
            </p>
          </div>

          {/* Stepper Status (PRD S1 & Design Brief Sec 5.1) */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "0.5rem",
            padding: "0.85rem"
          }}>
            <h4 style={{ fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.75rem" }}>
              Live Police Resolution Progress Tracker
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Step 1 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: getStepStatus("RECEIVED") === "COMPLETED" ? "#10B981" : "#E2E8F0",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "700"
                }}>
                  ✓
                </div>
                <div>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A", display: "block" }}>
                    1. {t.statusReceived}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                    Logged in Nagpur Traffic AI database. Geotagged.
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: getStepStatus("ASSIGNED") === "COMPLETED" ? "#10B981" : "#CBD5E1",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "700"
                }}>
                  {getStepStatus("ASSIGNED") === "COMPLETED" ? "✓" : "2"}
                </div>
                <div>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A", display: "block" }}>
                    2. {t.statusAssigned}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                    {selectedComplaint.assignedOfficerName
                      ? `Assigned to ${selectedComplaint.assignedOfficerName}`
                      : "Queued for police patrol assignment"}
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: getStepStatus("RESOLVED") === "COMPLETED" ? "#10B981" : "#CBD5E1",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "700"
                }}>
                  {getStepStatus("RESOLVED") === "COMPLETED" ? "✓" : "3"}
                </div>
                <div>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A", display: "block" }}>
                    3. {t.statusResolved}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                    {selectedComplaint.policeNote || "Awaiting police resolution update."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={onBack} className="btn-secondary" style={{ width: "100%", justifyContent: "center", background: "#E2E8F0", color: "#334155" }}>
        Back to Home
      </button>
    </div>
  );
}
