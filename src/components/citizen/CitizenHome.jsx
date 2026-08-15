import React, { useState } from "react";
import { PlusCircle, Search, MapPin, ThumbsUp, Shield, Smartphone, Globe, Car, AlertOctagon, ParkingSquare } from "lucide-react";
import LanguageSelector, { TRANSLATIONS } from "../common/LanguageSelector";
import ComplaintForm from "./ComplaintForm";
import TrackComplaint from "./TrackComplaint";

export default function CitizenHome({ junctions, complaints, currentLang, onSelectLang, onSubmitComplaint }) {
  const [screen, setScreen] = useState("HOME"); // HOME, NEW_COMPLAINT, TRACK
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0B0F19",
      padding: "1rem"
    }}>
      {/* Mobile Device Container Mockup */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        height: "100%",
        maxHeight: "820px",
        background: "#F8FAFC",
        color: "#0F172A",
        borderRadius: "1.25rem",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        border: "8px solid #1E293B",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Mobile Header Bar */}
        <div style={{
          background: "#1E40AF",
          color: "#FFFFFF",
          padding: "0.85rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Shield style={{ width: "20px", height: "20px", color: "#60A5FA" }} />
              <h2 style={{ fontSize: "0.95rem", fontWeight: "800", margin: 0 }}>
                NAGPUR TRAFFIC POLICE
              </h2>
            </div>
            <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />
          </div>
          <p style={{ fontSize: "0.72rem", color: "#93C5FD", margin: 0 }}>
            {t.tagline}
          </p>
        </div>

        {/* Dynamic Body Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {screen === "NEW_COMPLAINT" && (
            <ComplaintForm
              junctions={junctions}
              currentLang={currentLang}
              onSubmitComplaint={onSubmitComplaint}
              onCancel={() => setScreen("HOME")}
            />
          )}

          {screen === "TRACK" && (
            <TrackComplaint
              complaints={complaints}
              currentLang={currentLang}
              onBack={() => setScreen("HOME")}
            />
          )}

          {screen === "HOME" && (
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Primary Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <button
                  onClick={() => setScreen("NEW_COMPLAINT")}
                  className="btn-primary"
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "0.75rem",
                    fontSize: "0.95rem",
                    justifyContent: "center",
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  <PlusCircle style={{ width: "20px", height: "20px" }} />
                  {t.reportIssueBtn}
                </button>

                <button
                  onClick={() => setScreen("TRACK")}
                  className="btn-secondary"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    fontSize: "0.88rem",
                    justifyContent: "center",
                    background: "#FFFFFF",
                    color: "#1E40AF",
                    border: "1.5px solid #93C5FD"
                  }}
                >
                  <Search style={{ width: "18px", height: "18px" }} />
                  {t.trackIssueBtn}
                </button>
              </div>

              {/* Community Reports Feed Header */}
              <div style={{ marginTop: "0.5rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#0F172A", marginBottom: "0.6rem" }}>
                  {t.recentReports}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {complaints.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "0.6rem",
                        padding: "0.75rem",
                        display: "flex",
                        gap: "0.65rem",
                        alignItems: "flex-start"
                      }}
                    >
                      <img
                        src={item.photoUrl}
                        alt="Complaint snippet"
                        style={{ width: "56px", height: "56px", borderRadius: "0.4rem", objectFit: "cover" }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.1rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: "800", color: "#2563EB", fontFamily: "var(--font-mono)" }}>
                            {item.id}
                          </span>
                          <span style={{
                            background: item.status === "RESOLVED" ? "#D1FAE5" : "#DBEAFE",
                            color: item.status === "RESOLVED" ? "#065F46" : "#1E40AF",
                            fontSize: "0.65rem",
                            fontWeight: "800",
                            padding: "0.1rem 0.35rem",
                            borderRadius: "0.2rem"
                          }}>
                            {item.status}
                          </span>
                        </div>

                        <h4 style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A", margin: "0.1rem 0" }}>
                          {item.categoryLabel}
                        </h4>
                        <p style={{ fontSize: "0.72rem", color: "#64748B", margin: 0 }}>
                          📍 {item.junctionName}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
                          <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                            By {item.citizenName}
                          </span>
                          <span style={{ fontSize: "0.68rem", color: "#2563EB", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <ThumbsUp style={{ width: "11px", height: "11px" }} />
                            {item.upvotes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
