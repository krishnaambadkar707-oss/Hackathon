import React from "react";
import { X, Sparkles, AlertCircle, BarChart2, CheckCircle2, ShieldAlert, MapPin } from "lucide-react";

export default function ExplainabilityModal({ junction, onClose, onSimulateIncident }) {
  if (!junction) return null;

  const { name, zone, landmark, risk } = junction;
  const { score, level, color, breakdown, summary } = risk;

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
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "640px",
        maxHeight: "90vh",
        overflowY: "auto",
        backgroundColor: "#111827",
        border: "1px solid #374151",
        borderRadius: "0.75rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        padding: "1.5rem"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className={`badge-${level.toLowerCase()}`}>
                Risk Level: {level} ({score}/100)
              </span>
              <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Zone: {zone}</span>
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#F9FAFB", margin: 0 }}>
              {name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#9CA3AF", margin: "0.2rem 0 0 0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <MapPin style={{ width: "13px", height: "13px", color: "#60A5FA" }} />
              {landmark}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              padding: "0.25rem"
            }}
          >
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Explainability AI Reasoning Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
            <Sparkles style={{ width: "16px", height: "16px", color: "#60A5FA" }} />
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              AI Explainable Risk Factor Synthesis
            </h3>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#E0E7FF", margin: 0, lineHeight: "1.45" }}>
            "{summary}"
          </p>
        </div>

        {/* Weighted Factor Breakdown */}
        <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#F3F4F6", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <BarChart2 style={{ width: "16px", height: "16px", color: "#3B82F6" }} />
          Risk Score Formula Weight Decomposition
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
          {breakdown.map((item, idx) => (
            <div key={idx} style={{
              background: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
              padding: "0.85rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#F3F4F6" }}>
                  {item.factor} <span style={{ color: "#9CA3AF", fontWeight: "400" }}>({item.weightPercent}% weight)</span>
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#60A5FA" }}>
                  +{item.contribution} pts <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>({item.score}/100)</span>
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: "6px", background: "#374151", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.35rem" }}>
                <div style={{
                  height: "100%",
                  width: `${item.score}%`,
                  background: item.score >= 75 ? "#EF4444" : item.score >= 50 ? "#F59E0B" : "#10B981",
                  borderRadius: "9999px",
                  transition: "width 0.5s ease"
                }} />
              </div>

              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid #374151" }}>
          <button
            onClick={() => {
              onClose();
              onSimulateIncident(junction.id);
            }}
            className="btn-danger"
            style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
          >
            <ShieldAlert style={{ width: "15px", height: "15px" }} />
            Simulate Emergency Incident Here
          </button>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
