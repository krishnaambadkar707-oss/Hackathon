import React, { useState, useEffect } from "react";
import { Camera, MapPin, CheckCircle, ArrowRight, ShieldAlert, Car, AlertOctagon, ParkingSquare, Sparkles } from "lucide-react";
import { TRANSLATIONS } from "../common/LanguageSelector";

export default function ComplaintForm({ junctions, currentLang, onSubmitComplaint, onCancel, initialExtractedData = null }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const [category, setCategory] = useState(initialExtractedData?.category || "JAM");
  const [selectedJunctionId, setSelectedJunctionId] = useState(initialExtractedData?.junctionId || junctions[0]?.id || "j1");
  const [description, setDescription] = useState(initialExtractedData?.description || "");
  const [voterName, setVoterName] = useState(initialExtractedData?.citizenName || "");
  const [photoPreview, setPhotoPreview] = useState("https://images.unsplash.com/photo-1566232392379-afd9298e6a46?w=600&auto=format&fit=crop&q=60");
  const [submittedTrackingId, setSubmittedTrackingId] = useState(null);

  useEffect(() => {
    if (initialExtractedData) {
      if (initialExtractedData.category) setCategory(initialExtractedData.category);
      if (initialExtractedData.junctionId) setSelectedJunctionId(initialExtractedData.junctionId);
      if (initialExtractedData.description) setDescription(initialExtractedData.description);
      if (initialExtractedData.citizenName) setVoterName(initialExtractedData.citizenName);
    }
  }, [initialExtractedData]);

  const categories = [
    { id: "JAM", label: t.categoryJam, icon: Car, color: "#F59E0B" },
    { id: "ACCIDENT_HAZARD", label: t.categoryAccident, icon: AlertOctagon, color: "#EF4444" },
    { id: "RASH_DRIVING", label: t.categoryRash, icon: ShieldAlert, color: "#EC4899" },
    { id: "ILLEGAL_PARKING", label: t.categoryParking, icon: ParkingSquare, color: "#3B82F6" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedJunction = junctions.find((j) => j.id === selectedJunctionId);
    const trackingId = `NGP-TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      id: trackingId,
      junctionId: selectedJunctionId,
      junctionName: selectedJunction?.name || "Nagpur Junction",
      citizenName: voterName || "Nagpur Citizen",
      category,
      categoryLabel: categories.find((c) => c.id === category)?.label || "Traffic Issue",
      description: description || "Reported traffic issue at junction.",
      photoUrl: photoPreview,
      timestamp: new Date().toISOString(),
      status: "RECEIVED",
      assignedOfficerId: null,
      assignedOfficerName: null,
      upvotes: 1,
      policeNote: "Complaint logged into system queue and geotagged."
    };

    onSubmitComplaint(newComplaint);
    setSubmittedTrackingId(trackingId);
  };

  if (submittedTrackingId) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.15)",
          border: "2px solid #10B981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem auto"
        }}>
          <CheckCircle style={{ width: "32px", height: "32px", color: "#10B981" }} />
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", marginBottom: "0.25rem" }}>
          Complaint Submitted Successfully!
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1.25rem" }}>
          Your report has been logged and sent to Nagpur Traffic Police Control Room.
        </p>

        <div style={{
          background: "#F1F5F9",
          border: "1px solid #CBD5E1",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1.5rem"
        }}>
          <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "600", display: "block" }}>
            YOUR COMPLAINT TRACKING ID
          </span>
          <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#1E40AF", fontFamily: "var(--font-mono)" }}>
            {submittedTrackingId}
          </span>
        </div>

        <button onClick={onCancel} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Back to Citizen Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", padding: "1rem" }}>
      {/* AI Extraction Banner Badge if pre-filled */}
      {initialExtractedData && (
        <div style={{
          background: "rgba(37, 99, 235, 0.1)",
          border: "1px solid #3B82F6",
          color: "#1E40AF",
          fontSize: "0.75rem",
          fontWeight: "700",
          padding: "0.4rem 0.6rem",
          borderRadius: "0.4rem",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem"
        }}>
          <Sparkles style={{ width: "14px", height: "14px", color: "#2563EB" }} />
          Form pre-filled automatically by Citizen AI Assistant!
        </div>
      )}

      {/* Category Picker */}
      <div>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.5rem" }}>
          {t.selectCategory}
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: isSelected ? `2px solid ${cat.color}` : "1px solid #CBD5E1",
                  background: isSelected ? `${cat.color}15` : "#FFFFFF",
                  color: isSelected ? "#0F172A" : "#475569",
                  fontWeight: isSelected ? "700" : "500",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <Icon style={{ width: "18px", height: "18px", color: cat.color }} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Picker */}
      <div>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
          {t.selectLocation}
        </label>
        <select
          value={selectedJunctionId}
          onChange={(e) => setSelectedJunctionId(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #CBD5E1",
            background: "#FFFFFF",
            color: "#0F172A",
            fontSize: "0.85rem"
          }}
        >
          {junctions.map((j) => (
            <option key={j.id} value={j.id}>
              📍 {j.name} ({j.zone}) - {j.landmark}
            </option>
          ))}
        </select>
      </div>

      {/* Description & Citizen Name */}
      <div>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
          {t.addDetails}
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the obstruction or hazard (e.g., bus parked blocking lane)..."
          required
          style={{
            width: "100%",
            padding: "0.65rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #CBD5E1",
            background: "#FFFFFF",
            color: "#0F172A",
            fontSize: "0.85rem",
            fontFamily: "var(--font-primary)",
            marginBottom: "0.6rem"
          }}
        />

        <input
          type="text"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          placeholder="Your Name (Optional)"
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #CBD5E1",
            background: "#FFFFFF",
            color: "#0F172A",
            fontSize: "0.85rem"
          }}
        />
      </div>

      {/* Simulated Photo Evidence */}
      <div>
        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
          {t.photoLabel}
        </label>
        <div style={{
          position: "relative",
          height: "120px",
          borderRadius: "0.5rem",
          overflow: "hidden",
          border: "2px dashed #CBD5E1",
          background: "#F8FAFC"
        }}>
          <img src={photoPreview} alt="Evidence preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(15, 23, 42, 0.75)",
            color: "#FFF",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.7rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            <Camera style={{ width: "12px", height: "12px" }} />
            Geotagged Photo Ready
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
        <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1, justifyContent: "center", background: "#E2E8F0", color: "#334155" }}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
          {t.submitBtn}
          <ArrowRight style={{ width: "16px", height: "16px" }} />
        </button>
      </div>
    </form>
  );
}
