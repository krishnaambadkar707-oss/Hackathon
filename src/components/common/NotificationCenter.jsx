import React, { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle, CheckCircle, FileText, X, Check, Trash2, MapPin } from "lucide-react";

export default function NotificationCenter({ notifications, onMarkAsRead, onClearAll, onSelectJunction }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          background: "var(--bg-hover)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          padding: "0.4rem 0.6rem",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          position: "relative"
        }}
        title="Live Alerts & Notifications"
      >
        <Bell style={{ width: "16px", height: "16px", color: unreadCount > 0 ? "#EF4444" : "var(--text-secondary)" }} />
        {unreadCount > 0 && (
          <span style={{
            background: "#EF4444",
            color: "#FFF",
            fontSize: "0.65rem",
            fontWeight: "800",
            padding: "0.1rem 0.35rem",
            borderRadius: "9999px",
            animation: "pulse-red 2s infinite"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Notifications Dropdown */}
      {isOpen && (
        <div className="glass-panel" style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: "-120px",
          width: "350px",
          maxWidth: "calc(100vw - 24px)",
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          backgroundColor: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
          zIndex: 2500,
          padding: "1rem"
        }}>
          {/* Caret pointing up to Bell */}
          <div style={{
            position: "absolute",
            top: "-6px",
            right: "135px",
            width: "12px",
            height: "12px",
            backgroundColor: "var(--bg-panel)",
            borderTop: "1px solid var(--border-color)",
            borderLeft: "1px solid var(--border-color)",
            transform: "rotate(45deg)",
            zIndex: 2501
          }} />
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Bell style={{ width: "16px", height: "16px", color: "#3B82F6" }} />
              <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                Alert Center ({unreadCount} New)
              </h3>
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={onClearAll}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.72rem" }}
                title="Clear All Notifications"
              >
                Clear
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          </div>

          {/* Notifications Stream */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {notifications.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", margin: "1.5rem 0" }}>
                No active notifications. System operating normally.
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: item.read ? "var(--bg-card)" : "rgba(59, 130, 246, 0.12)",
                    border: `1px solid ${item.read ? "var(--border-color)" : "rgba(59, 130, 246, 0.3)"}`,
                    borderRadius: "0.5rem",
                    padding: "0.6rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: "700", color: item.type === "EMERGENCY" ? "#EF4444" : "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      {item.type === "EMERGENCY" ? <AlertTriangle style={{ width: "13px", height: "13px", color: "#EF4444" }} /> : <FileText style={{ width: "13px", height: "13px", color: "#3B82F6" }} />}
                      {item.title}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {item.time}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.35" }}>
                    {item.message}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.2rem" }}>
                    {!item.read && (
                      <button
                        onClick={() => onMarkAsRead(item.id)}
                        style={{ background: "transparent", border: "none", color: "#3B82F6", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                      >
                        <Check style={{ width: "11px", height: "11px" }} />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
