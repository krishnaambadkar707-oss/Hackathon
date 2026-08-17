import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shield, AlertTriangle, MapPin, Eye, PhoneCall, Plus, Minus, Target, Search, CloudSun } from "lucide-react";

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

function CustomMapHUDControls({ centerNagpur, onZoomIn, onZoomOut, onRecenter }) {
  return (
    <div className="map-hud-zoom">
      <button
        type="button"
        onClick={onZoomIn}
        className="map-hud-btn"
        title="Zoom In (+)"
      >
        <Plus style={{ width: "18px", height: "18px" }} />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="map-hud-btn"
        title="Zoom Out (-)"
      >
        <Minus style={{ width: "18px", height: "18px" }} />
      </button>
      <button
        type="button"
        onClick={onRecenter}
        className="map-hud-btn"
        title="Recenter Nagpur Map"
        style={{ marginTop: "4px" }}
      >
        <Target style={{ width: "16px", height: "16px", color: "var(--accent-cyan)" }} />
      </button>
    </div>
  );
}

function createRiskMarkerIcon(score, level, isSimulatedIncident) {
  let bgColor = "#00FF88";
  let pulseClass = "pulse-cyan-marker";
  if (level === "HIGH") {
    bgColor = "#FF3B3B";
    pulseClass = "pulse-red-marker";
  } else if (level === "MEDIUM") {
    bgColor = "#FFB700";
    pulseClass = "pulse-amber-marker";
  }

  if (isSimulatedIncident) {
    bgColor = "#DC2626";
    pulseClass = "pulse-red-marker";
  }

  const html = `
    <div class="${pulseClass}" style="
      width: 38px;
      height: 38px;
      background: ${bgColor};
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #060913;
      font-weight: 900;
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      box-shadow: 0 0 16px ${bgColor};
    ">
      ${score}
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-risk-icon",
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

function createOfficerMarkerIcon() {
  const html = `
    <div style="
      width: 32px;
      height: 32px;
      background: #00F0FF;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #060913;
      box-shadow: 0 0 14px #00F0FF;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-officer-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16]
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
  selectedJunction,
  searchQuery,
  setSearchQuery
}) {
  const centerNagpur = [21.1458, 79.0882];
  const nagpurBounds = [
    [20.85, 78.85],
    [21.35, 79.35]
  ];

  const [mapInstance, setMapInstance] = useState(null);

  const mapTileUrl = theme === "light"
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery) {
      const match = junctionsWithRisk.find(
        (j) => j.name.toLowerCase().includes(searchQuery.toLowerCase()) || j.zone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        onSelectJunction(match);
      }
    }
  };

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
        ref={setMapInstance}
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={mapTileUrl}
          maxNativeZoom={18}
          maxZoom={19}
        />
        <MapController selectedJunction={selectedJunction} />

        {/* Dispatch Connection Polylines */}
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
                color: isRedeployedLine ? "#FF3B3B" : assignment.isOverride ? "#FFB700" : "#00F0FF",
                weight: isRedeployedLine ? 4 : 2,
                dashArray: isRedeployedLine ? "6, 6" : "4, 4",
                opacity: 0.85
              }}
            />
          );
        })}

        {/* Junction Risk Markers */}
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
                  radius={30}
                  pathOptions={{
                    color: "#FFB700",
                    fillColor: "#FFB700",
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
                        <span style={{ background: "#FF3B3B", color: "#FFF", fontSize: "0.65rem", padding: "0.1rem 0.3rem", borderRadius: "0.2rem", fontWeight: "700" }}>
                          INCIDENT LIVE
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", margin: "0.2rem 0" }}>
                      {name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0 0 0.4rem 0" }}>
                      {landmark}
                    </p>

                    <div style={{ background: "var(--bg-card)", padding: "0.4rem", borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid var(--border-color)" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Stationed Officer:</span>
                      {assignedItem ? (
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent-cyan)" }}>
                          👮 {assignedItem.officerName} ({assignedItem.distanceKm} km)
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#FF6B6B" }}>
                          ⚠️ Unmanned Hotspot
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
                        Explain
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

        {/* Officer Patrol Markers */}
        {officers.map((officer) => (
          <Marker
            key={`off-${officer.id}`}
            position={[officer.lat, officer.lng]}
            icon={createOfficerMarkerIcon()}
          >
            <Popup>
              <div style={{ padding: "0.2rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
                  👮 {officer.name}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0.1rem 0 0.4rem 0" }}>
                  Badge: {officer.badgeNumber} | {officer.unit}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", margin: "0 0 0.4rem 0" }}>
                  Vehicle: {officer.vehicle}
                </p>
                <a href={`tel:${officer.phone}`} style={{ color: "var(--accent-cyan)", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
                  <PhoneCall style={{ width: "12px", height: "12px" }} />
                  {officer.phone}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating HUD Controls Overlay */}
      <CustomMapHUDControls
        centerNagpur={centerNagpur}
        onZoomIn={() => mapInstance && mapInstance.zoomIn()}
        onZoomOut={() => mapInstance && mapInstance.zoomOut()}
        onRecenter={() => mapInstance && mapInstance.flyTo(centerNagpur, 13, { animate: true })}
      />

      {/* Weather Widget Pill (bottom left matching screen_2.png) */}
      <div className="map-hud-weather">
        <CloudSun style={{ width: "16px", height: "16px", color: "var(--accent-cyan)" }} />
        <span>30°C CLOUDY</span>
      </div>

      {/* Search Input Box Pill (bottom center matching screen_2.png) */}
      <div className="map-hud-search">
        <Search style={{ width: "16px", height: "16px", color: "var(--accent-cyan)" }} />
        <input
          type="text"
          placeholder="SEARCH SECTOR OR JUNCTION."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
    </div>
  );
}
