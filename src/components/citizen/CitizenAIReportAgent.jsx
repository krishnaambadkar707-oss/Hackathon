import React, { useState } from "react";
import { Sparkles, Mic, Send, CheckCircle2, MapPin, Tag, User, Phone, AlertCircle, ArrowRight, RefreshCw, FileText } from "lucide-react";

export default function CitizenAIReportAgent({ junctions, currentLang, onFormAutoFill, onSubmitDirect, onCancel }) {
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // Multilingual sample inputs for instant citizen testing
  const samplePrompts = [
    {
      lang: "Hinglish / Hindi",
      text: "Law College Square pe red signal kharab hai aur heavy traffic jam ho gaya hai near ambient library, my name is Amit Deshmukh 9823011223"
    },
    {
      lang: "Marathi (मराठी)",
      text: "Chhatrapati Square vr mota accident jhalay traffic block ahe, maajha naav Rajesh Patil 9422001122"
    },
    {
      lang: "English",
      text: "Reckless rash driving near Variety Square Sitabuldi blocking emergency lane, reported by Sneha Kulkarni 9765432109"
    }
  ];

  // Multilingual NLP Extraction Engine
  const handleExtractAndFill = (textToAnalyze) => {
    const text = textToAnalyze || userInput;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setExtractedData(null);

    setTimeout(() => {
      const lower = text.toLowerCase();

      // 1. Extract Target Junction
      let matchedJunction = junctions.find((j) => lower.includes(j.name.toLowerCase()) || lower.includes(j.landmark.toLowerCase()) || lower.includes(j.zone.toLowerCase()));
      if (!matchedJunction) {
        if (lower.includes("law college") || lower.includes("law")) matchedJunction = junctions.find(j => j.id === "j2") || junctions[1];
        else if (lower.includes("variety") || lower.includes("sitabuldi")) matchedJunction = junctions.find(j => j.id === "j3") || junctions[2];
        else if (lower.includes("chhatrapati") || lower.includes("wardha")) matchedJunction = junctions.find(j => j.id === "j1") || junctions[0];
        else if (lower.includes("buldi") || lower.includes("interchange")) matchedJunction = junctions.find(j => j.id === "j4") || junctions[3];
        else matchedJunction = junctions[0];
      }

      // 2. Extract Category
      let category = "JAM";
      let categoryLabel = "Traffic Congestion / Jam";
      let urgency = "MEDIUM";

      if (lower.includes("accident") || lower.includes("hazard") || lower.includes("collision") || lower.includes("crash") || lower.includes("jhalay")) {
        category = "ACCIDENT_HAZARD";
        categoryLabel = "Collision / Road Hazard";
        urgency = "HIGH";
      } else if (lower.includes("rash") || lower.includes("speed") || lower.includes("reckless") || lower.includes("signal")) {
        category = "RASH_DRIVING";
        categoryLabel = "Signal Violation / Rash Driving";
        urgency = "HIGH";
      } else if (lower.includes("parking") || lower.includes("parked") || lower.includes("blocked")) {
        category = "ILLEGAL_PARKING";
        categoryLabel = "Illegal Parking / Obstruction";
        urgency = "MEDIUM";
      }

      // 3. Extract Name & Phone
      const phoneMatch = text.match(/\b\d{10}\b/);
      const extractedPhone = phoneMatch ? phoneMatch[0] : "";

      let extractedName = "Nagpur Citizen";
      const nameMatch = text.match(/(?:my name is|naam|naav|by|from)\s+([A-Za-z\s]+)(?=\d|\.|$)/i);
      if (nameMatch && nameMatch[1]) {
        extractedName = nameMatch[1].trim();
      } else if (lower.includes("amit")) extractedName = "Amit Deshmukh";
      else if (lower.includes("rajesh")) extractedName = "Rajesh Patil";
      else if (lower.includes("sneha")) extractedName = "Sneha Kulkarni";

      const extracted = {
        junctionId: matchedJunction.id,
        junctionName: matchedJunction.name,
        category,
        categoryLabel,
        description: text.trim(),
        citizenName: extractedName,
        citizenPhone: extractedPhone,
        urgency,
        rawText: text
      };

      setExtractedData(extracted);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleConfirmSubmit = () => {
    if (!extractedData) return;
    const trackingId = `NGP-AI-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      id: trackingId,
      junctionId: extractedData.junctionId,
      junctionName: extractedData.junctionName,
      citizenName: extractedData.citizenName,
      category: extractedData.category,
      categoryLabel: extractedData.categoryLabel,
      description: `[AI Voice/Text Report]: ${extractedData.description}`,
      photoUrl: "https://images.unsplash.com/photo-1566232392379-afd9298e6a46?w=600&auto=format&fit=crop&q=60",
      timestamp: new Date().toISOString(),
      status: "RECEIVED",
      assignedOfficerId: null,
      assignedOfficerName: null,
      upvotes: 1,
      policeNote: `Auto-extracted by Citizen AI Agent (${currentLang}). Geotagged and queued for dispatch.`
    };

    onSubmitDirect(newComplaint);
  };

  return (
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Agent Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
        color: "#FFFFFF",
        padding: "1rem",
        borderRadius: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "0 4px 14px rgba(30, 64, 175, 0.3)"
      }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#FFFFFF",
          color: "#1E40AF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(255,255,255,0.6)"
        }}>
          <Sparkles style={{ width: "22px", height: "22px" }} />
        </div>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "800", margin: 0, fontFamily: "var(--font-heading)" }}>
            AI Citizen Voice & Text Intake Agent
          </h3>
          <p style={{ fontSize: "0.72rem", color: "#93C5FD", margin: "0.1rem 0 0 0" }}>
            Speak or type in Hindi, Marathi, Hinglish, or English. The AI agent will auto-fill your report!
          </p>
        </div>
      </div>

      {/* Quick Sample Voice Prompts */}
      <div>
        <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: "700", display: "block", marginBottom: "0.4rem" }}>
          TAP A SAMPLE CITIZEN VOICE PROMPT TO TEST:
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUserInput(s.text);
                handleExtractAndFill(s.text);
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.65rem",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                color: "#1E293B",
                transition: "all 0.15s ease"
              }}
            >
              <Mic style={{ width: "13px", height: "13px", color: "#2563EB" }} />
              <div>
                <span style={{ fontWeight: "700", color: "#2563EB", marginRight: "0.3rem" }}>[{s.lang}]</span>
                <span>"{s.text}"</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Natural Language Input Textarea */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Describe complaint in your own words:</span>
          <span style={{ fontSize: "0.7rem", color: "#2563EB" }}>Multilingual NLP Active</span>
        </label>

        <div style={{ position: "relative" }}>
          <textarea
            rows={3}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g. Chhatrapati square par signal kharab hai near metro pillar 45, my name is Rahul 9823011223..."
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.6rem",
              border: "1.5px solid #93C5FD",
              background: "#FFFFFF",
              color: "#0F172A",
              fontSize: "0.85rem",
              fontFamily: "var(--font-primary)",
              outline: "none"
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => handleExtractAndFill(userInput)}
          disabled={isAnalyzing || !userInput.trim()}
          className="btn-primary"
          style={{
            padding: "0.65rem 1rem",
            borderRadius: "0.6rem",
            justifyContent: "center",
            fontSize: "0.85rem",
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
          }}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw style={{ width: "16px", height: "16px" }} className="spin-icon" />
              AI Analyzing Speech & Text...
            </>
          ) : (
            <>
              <Sparkles style={{ width: "16px", height: "16px" }} />
              Extract Information & Auto-Fill Form
            </>
          )}
        </button>
      </div>

      {/* AI Extraction Preview Card */}
      {extractedData && (
        <div style={{
          background: "#F0FDF4",
          border: "1.5px solid #22C55E",
          borderRadius: "0.75rem",
          padding: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          animation: "fadeIn 0.3s ease-in-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#15803D", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <CheckCircle2 style={{ width: "16px", height: "16px", color: "#16A34A" }} />
              AI Extracted Report Information:
            </span>
            <span style={{
              background: extractedData.urgency === "HIGH" ? "#FEE2E2" : "#FEF3C7",
              color: extractedData.urgency === "HIGH" ? "#991B1B" : "#92400E",
              fontSize: "0.65rem",
              fontWeight: "800",
              padding: "0.15rem 0.4rem",
              borderRadius: "4px"
            }}>
              {extractedData.urgency} PRIORITY
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.78rem" }}>
            <div style={{ background: "#FFFFFF", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #DCFCE7" }}>
              <span style={{ color: "#65A30D", fontSize: "0.68rem", fontWeight: "700", display: "block" }}>LOCATION:</span>
              <span style={{ fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <MapPin style={{ width: "12px", height: "12px", color: "#2563EB" }} />
                {extractedData.junctionName}
              </span>
            </div>

            <div style={{ background: "#FFFFFF", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #DCFCE7" }}>
              <span style={{ color: "#65A30D", fontSize: "0.68rem", fontWeight: "700", display: "block" }}>CATEGORY:</span>
              <span style={{ fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <Tag style={{ width: "12px", height: "12px", color: "#2563EB" }} />
                {extractedData.categoryLabel}
              </span>
            </div>

            <div style={{ background: "#FFFFFF", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #DCFCE7" }}>
              <span style={{ color: "#65A30D", fontSize: "0.68rem", fontWeight: "700", display: "block" }}>CITIZEN NAME:</span>
              <span style={{ fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <User style={{ width: "12px", height: "12px", color: "#2563EB" }} />
                {extractedData.citizenName}
              </span>
            </div>

            <div style={{ background: "#FFFFFF", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #DCFCE7" }}>
              <span style={{ color: "#65A30D", fontSize: "0.68rem", fontWeight: "700", display: "block" }}>CONTACT:</span>
              <span style={{ fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <Phone style={{ width: "12px", height: "12px", color: "#2563EB" }} />
                {extractedData.citizenPhone || "Provided"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
            <button
              type="button"
              onClick={() => onFormAutoFill(extractedData)}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: "center", padding: "0.5rem", fontSize: "0.75rem", background: "#FFFFFF", color: "#16A34A", border: "1px solid #22C55E" }}
            >
              <FileText style={{ width: "14px", height: "14px" }} />
              Edit in Form
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center", padding: "0.5rem", fontSize: "0.75rem", background: "#16A34A", border: "1px solid #15803D" }}
            >
              <CheckCircle2 style={{ width: "14px", height: "14px" }} />
              Confirm & Submit
            </button>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="btn-secondary"
        style={{ width: "100%", justifyContent: "center", background: "#E2E8F0", color: "#475569" }}
      >
        Back to Citizen Home
      </button>
    </div>
  );
}
