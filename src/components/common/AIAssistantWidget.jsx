import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, User, RefreshCw, PhoneCall, Shield, AlertCircle } from "lucide-react";

export default function AIAssistantWidget({ junctionsWithRisk, officers, complaints, currentLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! I am Nagpur Traffic AI Assistant (नागपुर ट्रॅफिक एआय मित्र). How can I assist you with traffic risk analysis, police patrol dispatch, or filing a complaint today?"
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Suggested Prompts
  const quickPrompts = [
    "What is the traffic risk at Variety Square?",
    "How do I file a citizen traffic complaint?",
    "Which police officer is closest to Law College Sq?",
    "Nagpur Emergency Traffic Helpline numbers"
  ];

  // Smart Context-Aware Response Generator
  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Variety Square
    if (q.includes("variety") || q.includes("sitabuldi")) {
      const j = junctionsWithRisk.find((item) => item.name.toLowerCase().includes("variety"));
      if (j) {
        return `🚦 **Variety Square Traffic Risk Summary:**\n- **Current Risk Score:** ${j.risk.score}/100 (${j.risk.level})\n- **AI Diagnosis:** ${j.risk.summary}\n- **Key Contributors:** High pedestrian market footfall & bus bay encroachment.`;
      }
    }

    // 2. Law College Square
    if (q.includes("law college") || q.includes("amravati")) {
      const j = junctionsWithRisk.find((item) => item.name.toLowerCase().includes("law college"));
      if (j) {
        return `🚨 **Law College Square Status:**\n- **Current Risk Score:** ${j.risk.score}/100 (${j.risk.level})\n- **Assigned Patrol:** Sub-Inspector Amit Patil (Patrol Bike Bullet-04).\n- **Vulnerability:** Blind curve descent from Amravati Road Flyover near college zone.`;
      }
    }

    // 3. How to file complaint
    if (q.includes("file") || q.includes("report") || q.includes("complaint")) {
      return `📝 **How to File a Citizen Report (Under 60 Seconds):**\n1. Click on **'Citizen Reporting App'** mode in top navigation.\n2. Tap **'Report Traffic Issue'**.\n3. Pick category (*Jam*, *Accident*, *Rash Driving*, or *Illegal Parking*).\n4. Pin your location on the Nagpur map and click **Submit**.\n5. You will receive a unique tracking ID (e.g. \`NGP-TRF-2026-8942\`) to monitor live police action!`;
    }

    // 4. Officer location / closest
    if (q.includes("officer") || q.includes("police") || q.includes("patrol")) {
      const activeOfficersCount = officers.length;
      return `👮 **Nagpur Traffic Division Patrol Roster:**\n- Currently **${activeOfficersCount} active officers** on duty.\n- **Senior Officer:** Inspector Rajesh Deshmukh stationed at Variety Sq (Interceptor Cruiser NGP-01).\n- **Flying Squad:** Assistant Inspector Suresh Kadam patrolling Wardha Road Corridor.`;
    }

    // 5. Emergency Helplines
    if (q.includes("helpline") || q.includes("emergency") || q.includes("number") || q.includes("contact")) {
      return `📞 **Nagpur City Emergency Contact Directory:**\n- **Nagpur Traffic Control Room:** 112 / +91 712 2561222\n- **Ambulance Dispatch:** 108\n- **Police Control Room:** 100\n- **Women Safety Helpline:** 1091`;
    }

    // Default Fallback Response
    return `🤖 Based on Nagpur Traffic AI real-time analysis:\n- Monitored Corridors: **Sitabuldi, Sadar, Wardha Road, Amravati Road**.\n- High-Risk Hotspots: **Variety Sq (${junctionsWithRisk[0]?.risk.score}/100)**, **Law College Sq (${junctionsWithRisk[1]?.risk.score}/100)**.\n\nYou can ask me about any Nagpur junction risk score, patrol officer location, or filing a report!`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI Agent Response delay
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      setMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
    }, 500);
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 3000,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "#FFFFFF",
            border: "2px solid #60A5FA",
            borderRadius: "9999px",
            padding: "0.75rem 1.25rem",
            fontWeight: "700",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.5)",
            transition: "all 0.2s ease"
          }}
        >
          <Bot style={{ width: "20px", height: "20px" }} />
          Nagpur Traffic AI Mitr
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
        </button>
      )}

      {/* AI Assistant Chat Panel */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 3000,
          width: "380px",
          height: "520px",
          backgroundColor: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
            color: "#FFF",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bot style={{ width: "22px", height: "22px" }} />
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", margin: 0 }}>
                  Nagpur Traffic AI Mitr
                </h3>
                <span style={{ fontSize: "0.68rem", color: "#93C5FD" }}>
                  AI Assistant & Traffic Guidance System
                </span>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#FFF", cursor: "pointer" }}>
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: "0.85rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--bg-main)" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  maxWidth: "82%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                  lineHeight: "1.45",
                  whiteSpace: "pre-line",
                  background: msg.sender === "user" ? "#2563EB" : "var(--bg-card)",
                  color: msg.sender === "user" ? "#FFF" : "var(--text-primary)",
                  border: msg.sender === "user" ? "none" : "1px solid var(--border-color)"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: "0.4rem 0.75rem", background: "var(--bg-panel)", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.3rem", overflowX: "auto" }}>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "0.68rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "9999px",
                  background: "var(--bg-hover)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer"
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "0.65rem",
              background: "var(--bg-panel)",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "0.5rem"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Mitr about Nagpur traffic..."
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "0.8rem"
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: "0.5rem 0.75rem" }}>
              <Send style={{ width: "15px", height: "15px" }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
