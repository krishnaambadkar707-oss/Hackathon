import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shield, AlertTriangle, MapPin, Eye, PhoneCall, Plus, Minus, Target, Compass } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapController({ selectedJunction }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (selectedJunction && selectedJunction.lat && selectedJunction.lng) {
      map.flyTo([selectedJunction.lat, selectedJunction.lng], 15, {
        animate: true,
        duration: 1.2
      });
    }
  }, [selectedJunction, map]);

  return null;
}

function CustomZoomControls({ centerNagpur, highRiskJunctions }) {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleRecenter = () => {
    map.flyTo(centerNagpur, 13, { animate: true, duration: 1 });
  };

  const handleFocusHighRisk = () => {
    if (highRiskJunctions && highRiskJunctions.length > 0) {
      const highest = highRiskJunctions[0];
      map.flyTo([highest.lat, highest.lng], 15, { animate: true, duration: 1 });
    }
  };

  return (
    <div className="map-zoom-controls">
      <button
        type="button"
        onClick={handleZoomIn}
        className="map-zoom-btn"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <Plus style={{ width: "18px", height: "18px" }} />
      </button>
      <button
        type="button"
        onClick={handleZoomOut}
        className="map-zoom-btn"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <Minus style={{ width: "18px", height: "18px" }} />
      </button>
      <button
        type="button"
        onClick={handleRecenter}
        className="map-recenter-btn"
        title="Reset Map View to Nagpur Center"
      >
        <Target style={{ width: "15px", height: "15px", color: "#3B82F6" }} />
        <span>Recenter Nagpur</span>
      </button>
      {highRiskJunctions && highRiskJunctions.length > 0 && (
        <button
          type="button"
          onClick={handleFocusHighRisk}
          className="map-recenter-btn"
          style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#EF4444" }}
          title="Zoom to Highest Risk Hotspot"
        >
          <AlertTriangle style={{ width: "14px", height: "14px", color: "#EF4444" }} />
          <span>Top Hotspot</span>
        </button>
      )}
    </div>
  );
}

function createRiskMarkerIcon(score, level, isSimulatedIncident) {
  let bgColor = "#10B981";
  let pulseClass = "";
  if (level === "HIGH") {
    bgColor = "#EF4444";
    pulseClass = "pulse-red-marker";
  } else if (level === "MEDIUM") {
    bgColor = "#F59E0B";
    pulseClass = "pulse-amber-marker";
  }

  if (isSimulatedIncident) {
    bgColor = "#DC2626";
    pulseClass = "pulse-red-marker";
  }

  const html = `
    <div class="${pulseClass}" style="
      width: 36px;
      height: 36px;
      background: ${bgColor};
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    ">
      ${score}
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-risk-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

function createOfficerMarkerIcon(officerName) {
  const html = `
    <div style="
      width: 30px;
      height: 30px;
      background: #2563EB;
      border: 2px solid #60A5FA;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.8);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-officer-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function HeatmapView({
  junctionsWithRisk,
  officers,
  aiAssignments,
  simulatedIncident,
  theme,
  onSelectJunction,
  onOpenOverride,
  selectedJunction
}) {
  const centerNagpur = [21.1458, 79.0882]; // Sitabuldi Central
  const nagpurBounds = [
    [20.85, 78.85],
    [21.35, 79.35]
  ];

  const highRiskJunctions = junctionsWithRisk.filter((j) => j.risk.level === "HIGH");

  const mapTileUrl = theme === "light"
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={centerNagpur}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        scrollWheelZoom={true}
        zoomControl={false}
        maxBounds={nagpurBounds}
        maxBoundsViscosity={0.8}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={mapTileUrl}
          maxNativeZoom={18}
          maxZoom={19}
        />
        <MapController selectedJunction={selectedJunction} />
        <CustomZoomControls centerNagpur={centerNagpur} highRiskJunctions={highRiskJunctions} />

        {aiAssignments.assignments.map((assignment, idx) => {
          const junction = junctionsWithRisk.find((j) => j.id === assignment.junctionId);
          const officer = officers.find((o) => o.id === assignment.officerId);
          if (!junction || !officer) return null;

          const isRedeployedLine = simulatedIncident && simulatedIncident.redeployedOfficerId === officer.id;

          return (
            <Polyline
              key={`path-${idx}`}
              positions={[
                [officer.lat, officer.lng],
                [junction.lat, junction.lng]
              ]}
              pathOptions={{
                color: isRedeployedLine ? "#EF4444" : assignment.isOverride ? "#F59E0B" : "#3B82F6",
                weight: isRedeployedLine ? 4 : 2,
                dashArray: isRedeployedLine ? "6, 6" : "4, 4",
                opacity: 0.8
              }}
            />
          );
        })}

        {junctionsWithRisk.map((junction) => {
          const { id, name, lat, lng, landmark, risk } = junction;
          const isSimulated = simulatedIncident && simulatedIncident.junctionId === id;
          const assignedItem = aiAssignments.assignments.find((a) => a.junctionId === id);
          const isCoverageGap = simulatedIncident && simulatedIncident.uncoveredJunctionId === id;

          return (
            <React.Fragment key={`j-${id}`}>
              {isCoverageGap && (
                <CircleMarker
                  center={[lat, lng]}
                  radius={28}
                  pathOptions={{
                    color: "#F59E0B",
                    fillColor: "#F59E0B",
                    fillOpacity: 0.25,
                    dashArray: "4, 4"
                  }}
                />
              )}

              <Marker
                position={[lat, lng]}
                icon={createRiskMarkerIcon(risk.score, risk.level, isSimulated)}
              >
                <Popup>
                  <div style={{ padding: "0.2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span className={`badge-${risk.level.toLowerCase()}`}>
                        Score: {risk.score}/100
                      </span>
                      {isSimulated && (
                        <span style={{ background: "#DC2626", color: "#FFF", fontSize: "0.65rem", padding: "0.1rem 0.3rem", borderRadius: "0.2rem", fontWeight: "700" }}>
                          INCIDENT LIVE
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", margin: "0.2rem 0" }}>
                      {name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0 0 0.4rem 0" }}>
                      {landmark}
                    </p>

                    <div style={{ background: "var(--bg-card)", padding: "0.4rem", borderRadius: "0.375rem", marginBottom: "0.5rem", border: "1px solid var(--border-color)" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Officer Assigned:</span>
                      {assignedItem ? (
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3B82F6" }}>
                          👮 {assignedItem.officerName} ({assignedItem.distanceKm} km away)
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#EF4444" }}>
                          ⚠️ Unmanned High Risk Hotspot
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => onSelectJunction(junction)}
                        className="btn-primary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem", flex: 1 }}
                      >
                        <Eye style={{ width: "12px", height: "12px" }} />
                        Explain Score
                      </button>
                      <button
                        onClick={() => onOpenOverride(junction)}
                        className="btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}
                      >
                        Reassign
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {officers.map((officer) => (
          <Marker
            key={`off-${officer.id}`}
            position={[officer.lat, officer.lng]}
            icon={createOfficerMarkerIcon(officer.name)}
          >
            <Popup>
              <div style={{ padding: "0.2rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  👮 {officer.name}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0.1rem 0 0.4rem 0" }}>
                  Badge: {officer.badgeNumber} | {officer.unit}
                </p>
                <p style={{ fontSize: "0.72rem", color: "#3B82F6", margin: "0 0 0.4rem 0" }}>
                  Vehicle: {officer.vehicle}
                </p>
                <a href={`tel:${officer.phone}`} style={{ color: "#3B82F6", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
                  <PhoneCall style={{ width: "12px", height: "12px" }} />
                  {officer.phone}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="glass-panel" style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 1000,
        padding: "0.6rem 0.85rem",
        borderRadius: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        fontSize: "0.75rem"
      }}>
        <span style={{ fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          Live Map Legend
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>High Risk Score (&gt;70)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>Medium Risk (45-70)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>Low Risk (&lt;45)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2563EB" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>Active Police Patrol Officer</span>
        </div>
      </div>
    </div>
  );
}
