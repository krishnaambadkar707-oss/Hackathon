import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/common/Navbar";
import CommandSidebar from "./components/controlroom/CommandSidebar";
import ExplainabilityModal from "./components/common/ExplainabilityModal";
import DashboardHeader from "./components/controlroom/DashboardHeader";
import HeatmapView from "./components/controlroom/HeatmapView";
import RankedRiskList from "./components/controlroom/RankedRiskList";
import IncidentSimulator from "./components/controlroom/IncidentSimulator";
import BaselineComparison from "./components/controlroom/BaselineComparison";
import ManualOverrideModal from "./components/controlroom/ManualOverrideModal";
import CitizenHome from "./components/citizen/CitizenHome";
import AnalyticsView from "./components/controlroom/AnalyticsView";
import DeploymentView from "./components/controlroom/DeploymentView";
import IncidentLogsView from "./components/controlroom/IncidentLogsView";

import HistoryDrawer from "./components/common/HistoryDrawer";
import NotificationCenter from "./components/common/NotificationCenter";
import SettingsModal from "./components/common/SettingsModal";
import AIAssistantWidget from "./components/common/AIAssistantWidget";

import { calculateRiskScore } from "./services/riskEngine";
import { runAIAllocation, calculateBaselineVsAIMetrics } from "./services/allocationEngine";
import { storageService } from "./services/storageService";

export default function App() {
  // Main Top Bar Navigation View (CONTROL_ROOM, CITIZEN, ANALYTICS, DEPLOYMENT, INCIDENT_LOGS)
  const [viewMode, setViewMode] = useState(storageService.getViewMode() || "CONTROL_ROOM");
  // Left Sidebar Sub-View (MAP_OVERVIEW, INCIDENT_LOGS, RISK_HEATMAP, RESOURCE_HUB, SIMULATION)
  const [activeSubView, setActiveSubView] = useState("MAP_OVERVIEW");

  const [currentLang, setCurrentLang] = useState(storageService.getLanguage());
  const [useAIPlan, setUseAIPlan] = useState(true);

  // Theme & Settings Preferences State
  const [theme, setTheme] = useState(localStorage.getItem("nagpur_theme") || "dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefreshSec, setAutoRefreshSec] = useState(15);

  // Sync theme attribute on document root element & localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nagpur_theme", theme);
  }, [theme]);

  // Background Mode (command-room backdrop screen_1.png vs standard dark GIS)
  const [isCommandRoomBg, setIsCommandRoomBg] = useState(true);

  // Search Filter Query for bottom map search bar
  const [searchQuery, setSearchQuery] = useState("");

  // Core Datasets & Persistent States
  const [junctions, setJunctions] = useState(storageService.getJunctions());
  const [officers, setOfficers] = useState(storageService.getOfficers());
  const [complaints, setComplaints] = useState(storageService.getComplaints());
  const [overrides, setOverrides] = useState(storageService.getOverrides());
  const [simulatedIncident, setSimulatedIncident] = useState(storageService.getSimulatedIncident());

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      type: "ALERT",
      title: "Unmanned High Risk Hotspot Alert",
      message: "Buldi Interchange has risk score 84 with 0 stationed officers.",
      time: "19:30",
      read: false
    },
    {
      id: "n2",
      type: "INFO",
      title: "New Citizen Report Logged",
      message: "Sneha Kulkarni filed broken signal hazard at Law College Sq.",
      time: "18:30",
      read: false
    }
  ]);

  // Active Modals & Drawers Triggers
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [explainJunction, setExplainJunction] = useState(null);
  const [overrideJunction, setOverrideJunction] = useState(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync navigation & language
  useEffect(() => {
    storageService.setViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    storageService.setLanguage(currentLang);
  }, [currentLang]);

  // Compute Risk Scores for all Nagpur Junctions
  const junctionsWithRisk = useMemo(() => {
    return junctions.map((j) => {
      const activeIncidentId = simulatedIncident ? simulatedIncident.junctionId : null;
      const risk = calculateRiskScore(j, complaints, activeIncidentId);
      return {
        ...j,
        risk
      };
    });
  }, [junctions, complaints, simulatedIncident]);

  // Compute AI Personnel Allocation
  const aiAssignments = useMemo(() => {
    return runAIAllocation(junctionsWithRisk, officers, overrides);
  }, [junctionsWithRisk, officers, overrides]);

  // Compute Baseline vs AI Comparison Metrics
  const metrics = useMemo(() => {
    return calculateBaselineVsAIMetrics(junctionsWithRisk, aiAssignments, officers);
  }, [junctionsWithRisk, aiAssignments, officers]);

  // Handle New Citizen Complaint Submission
  const handleAddComplaint = (newComplaint) => {
    const updated = storageService.saveComplaint(newComplaint);
    setComplaints(updated);

    const newNotif = {
      id: `n-${Date.now()}`,
      type: "INFO",
      title: `New Report: ${newComplaint.categoryLabel}`,
      message: `${newComplaint.citizenName} reported issue at ${newComplaint.junctionName}. ID: ${newComplaint.id}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle Live Incident Trigger
  const handleTriggerIncident = (targetJunctionId) => {
    const targetJunction = junctions.find((j) => j.id === targetJunctionId);
    if (!targetJunction) return;

    const currentAssignments = aiAssignments.assignments;
    let redeployedOfficerId = officers[0]?.id;
    let uncoveredJunctionId = "j1";

    if (currentAssignments.length > 0) {
      const nonIncidentAssignments = currentAssignments.filter((a) => a.junctionId !== targetJunctionId);
      if (nonIncidentAssignments.length > 0) {
        redeployedOfficerId = nonIncidentAssignments[0].officerId;
        uncoveredJunctionId = nonIncidentAssignments[0].junctionId;
      }
    }

    const incidentData = {
      junctionId: targetJunctionId,
      junctionName: targetJunction.name,
      redeployedOfficerId,
      uncoveredJunctionId,
      timestamp: new Date().toISOString()
    };

    storageService.setSimulatedIncident(incidentData);
    setSimulatedIncident(incidentData);

    const emergencyNotif = {
      id: `n-inc-${Date.now()}`,
      type: "EMERGENCY",
      title: "🚨 EMERGENCY INCIDENT SIMULATED",
      message: `High priority collision reported at ${targetJunction.name}. Dynamic officer redeployment triggered!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications((prev) => [emergencyNotif, ...prev]);
  };

  const handleClearIncident = () => {
    storageService.setSimulatedIncident(null);
    setSimulatedIncident(null);
  };

  // Handle Manual Override
  const handleSaveOverride = (junctionId, officerId, reason) => {
    const updated = storageService.saveOverride(junctionId, officerId, reason);
    setOverrides(updated);
  };

  const handleRemoveOverride = (junctionId) => {
    const updated = storageService.removeOverride(junctionId);
    setOverrides(updated);
  };

  const handleMarkNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleOpenIncidentLogs = () => {
    setViewMode("INCIDENT_LOGS");
    setActiveSubView("INCIDENT_LOGS");
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-main)",
      overflow: "hidden"
    }} className={isCommandRoomBg ? "command-room-bg" : ""}>
      {/* Top Navigation Bar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          if (mode === "CONTROL_ROOM" && activeSubView === "INCIDENT_LOGS") {
            setActiveSubView("MAP_OVERVIEW");
          }
        }}
        useAIPlan={useAIPlan}
        setUseAIPlan={setUseAIPlan}
        theme={theme}
        setTheme={setTheme}
        isCommandRoomBg={isCommandRoomBg}
        setIsCommandRoomBg={setIsCommandRoomBg}
        simulatedIncident={simulatedIncident}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        onOpenIncidentModal={() => handleTriggerIncident("j2")}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenIncidentLogs={handleOpenIncidentLogs}
      />

      {/* Main Body View Switching */}
      {viewMode === "CITIZEN" ? (
        <CitizenHome
          junctions={junctions}
          complaints={complaints}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          onSubmitComplaint={handleAddComplaint}
        />
      ) : viewMode === "ANALYTICS" ? (
        <AnalyticsView
          metrics={metrics}
          junctionsWithRisk={junctionsWithRisk}
          aiAssignments={aiAssignments}
        />
      ) : viewMode === "DEPLOYMENT" ? (
        <DeploymentView
          officers={officers}
          junctionsWithRisk={junctionsWithRisk}
          aiAssignments={aiAssignments}
          onOpenOverride={(j) => {
            setSelectedJunction(j);
            setOverrideJunction(j);
          }}
        />
      ) : viewMode === "INCIDENT_LOGS" ? (
        <IncidentLogsView
          complaints={complaints}
          simulatedIncident={simulatedIncident}
          overrides={overrides}
          junctionsWithRisk={junctionsWithRisk}
        />
      ) : (
        /* CONTROL ROOM View Layout with Left HUD Sidebar */
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Left Collapsible HUD Command Sidebar */}
          <CommandSidebar
            activeSubView={activeSubView}
            setActiveSubView={setActiveSubView}
            onOpenDispatchModal={() => handleTriggerIncident("j1")}
            onOpenSystemStatusModal={() => setIsHistoryOpen(true)}
          />

          {/* Sub-View Content rendering */}
          {activeSubView === "INCIDENT_LOGS" ? (
            <IncidentLogsView
              complaints={complaints}
              simulatedIncident={simulatedIncident}
              overrides={overrides}
              junctionsWithRisk={junctionsWithRisk}
            />
          ) : activeSubView === "RESOURCE_HUB" ? (
            <DeploymentView
              officers={officers}
              junctionsWithRisk={junctionsWithRisk}
              aiAssignments={aiAssignments}
              onOpenOverride={(j) => {
                setSelectedJunction(j);
                setOverrideJunction(j);
              }}
            />
          ) : (
            /* MAP_OVERVIEW, RISK_HEATMAP & SIMULATION Sub-Views */
            <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
              {/* Top Floating KPI Header Cards Bar */}
              <DashboardHeader
                metrics={metrics}
                activeZone="Sitabuldi & West Nagpur"
                simulatedIncident={simulatedIncident}
                unmannedHotspotsCount={aiAssignments.unmannedHighRiskHotspots.length}
                onOpenComparison={() => setShowComparisonModal(true)}
              />

              {/* Simulation Banner Bar */}
              {(simulatedIncident || activeSubView === "SIMULATION") && (
                <div style={{
                  position: "absolute",
                  top: "90px",
                  left: "320px",
                  right: "380px",
                  zIndex: 890
                }}>
                  <IncidentSimulator
                    simulatedIncident={simulatedIncident}
                    junctions={junctionsWithRisk}
                    officers={officers}
                    onTriggerIncident={handleTriggerIncident}
                    onClearIncident={handleClearIncident}
                  />
                </div>
              )}

              {/* Center Map HUD Area */}
              <div style={{ flex: 1, height: "100%", position: "relative" }}>
                <HeatmapView
                  junctionsWithRisk={junctionsWithRisk}
                  officers={officers}
                  aiAssignments={aiAssignments}
                  simulatedIncident={simulatedIncident}
                  theme={theme}
                  selectedJunction={selectedJunction}
                  onSelectJunction={(j) => {
                    setSelectedJunction(j);
                    setExplainJunction(j);
                  }}
                  onOpenOverride={(j) => {
                    setSelectedJunction(j);
                    setOverrideJunction(j);
                  }}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              {/* Right Floating Ranked Risks Panel */}
              <RankedRiskList
                junctionsWithRisk={junctionsWithRisk}
                aiAssignments={aiAssignments}
                officers={officers}
                simulatedIncident={simulatedIncident}
                onSelectJunction={(j) => {
                  setSelectedJunction(j);
                  setExplainJunction(j);
                }}
                onOpenOverride={(j) => {
                  setSelectedJunction(j);
                  setOverrideJunction(j);
                }}
                onTriggerIncident={handleTriggerIncident}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals & Drawers */}
      <ExplainabilityModal
        junction={explainJunction}
        onClose={() => setExplainJunction(null)}
        onSimulateIncident={handleTriggerIncident}
      />

      {showComparisonModal && (
        <BaselineComparison
          metrics={metrics}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      <ManualOverrideModal
        junction={overrideJunction}
        officers={officers}
        overrides={overrides}
        onSaveOverride={handleSaveOverride}
        onRemoveOverride={handleRemoveOverride}
        onClose={() => setOverrideJunction(null)}
      />

      <HistoryDrawer
        complaints={complaints}
        overrides={overrides}
        simulatedIncident={simulatedIncident}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Fully Wired Settings Modal */}
      <SettingsModal
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        autoRefreshSec={autoRefreshSec}
        setAutoRefreshSec={setAutoRefreshSec}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Floating AI Assistant Widget ("Nagpur Traffic AI Mitr") */}
      <AIAssistantWidget
        junctionsWithRisk={junctionsWithRisk}
        officers={officers}
        complaints={complaints}
        currentLang={currentLang}
      />
    </div>
  );
}
