import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/common/Navbar";
import ExplainabilityModal from "./components/common/ExplainabilityModal";
import DashboardHeader from "./components/controlroom/DashboardHeader";
import HeatmapView from "./components/controlroom/HeatmapView";
import RankedRiskList from "./components/controlroom/RankedRiskList";
import IncidentSimulator from "./components/controlroom/IncidentSimulator";
import BaselineComparison from "./components/controlroom/BaselineComparison";
import ManualOverrideModal from "./components/controlroom/ManualOverrideModal";
import CitizenHome from "./components/citizen/CitizenHome";

import HistoryDrawer from "./components/common/HistoryDrawer";
import NotificationCenter from "./components/common/NotificationCenter";
import SettingsModal from "./components/common/SettingsModal";
import AIAssistantWidget from "./components/common/AIAssistantWidget";

import { calculateRiskScore } from "./services/riskEngine";
import { runAIAllocation, calculateBaselineVsAIMetrics } from "./services/allocationEngine";
import { storageService } from "./services/storageService";

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState(storageService.getViewMode());
  const [currentLang, setCurrentLang] = useState(storageService.getLanguage());
  const [useAIPlan, setUseAIPlan] = useState(true);

  // Theme & Preferences State
  const [theme, setTheme] = useState(localStorage.getItem("nagpur_theme") || "dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefreshSec, setAutoRefreshSec] = useState(15);

  // Sync theme attribute on document root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nagpur_theme", theme);
  }, [theme]);

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

    // Add live notification
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

  // Handle Live Incident Trigger (C7)
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

    // Add Emergency Notification
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

  // Handle Manual Override (C8)
  const handleSaveOverride = (junctionId, officerId, reason) => {
    const updated = storageService.saveOverride(junctionId, officerId, reason);
    setOverrides(updated);
  };

  const handleRemoveOverride = (junctionId) => {
    const updated = storageService.removeOverride(junctionId);
    setOverrides(updated);
  };

  // Handle Notifications
  const handleMarkNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Handle Data Reset
  const handleResetData = () => {
    const reset = storageService.resetAllData();
    setJunctions(reset.junctions);
    setOfficers(reset.officers);
    setComplaints(reset.complaints);
    setOverrides(reset.overrides);
    setSimulatedIncident(reset.simulatedIncident);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-main)" }}>
      {/* Navbar Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        useAIPlan={useAIPlan}
        setUseAIPlan={setUseAIPlan}
        theme={theme}
        setTheme={setTheme}
        simulatedIncident={simulatedIncident}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        onOpenIncidentModal={() => handleTriggerIncident("j2")}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Body */}
      {viewMode === "CITIZEN" ? (
        <CitizenHome
          junctions={junctions}
          complaints={complaints}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          onSubmitComplaint={handleAddComplaint}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Live Dashboard KPI Header */}
          <DashboardHeader
            metrics={metrics}
            activeZone="Sitabuldi & West Nagpur"
            simulatedIncident={simulatedIncident}
            unmannedHotspotsCount={aiAssignments.unmannedHighRiskHotspots.length}
            onOpenComparison={() => setShowComparisonModal(true)}
          />

          {/* Live Incident Simulator Execution Bar */}
          <IncidentSimulator
            simulatedIncident={simulatedIncident}
            junctions={junctionsWithRisk}
            officers={officers}
            onTriggerIncident={handleTriggerIncident}
            onClearIncident={handleClearIncident}
          />

          {/* Main 2-Column Split: Map & Ranked List */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", overflow: "hidden" }}>
            {/* Left Column: Interactive Heatmap */}
            <HeatmapView
              junctionsWithRisk={junctionsWithRisk}
              officers={officers}
              aiAssignments={aiAssignments}
              simulatedIncident={simulatedIncident}
              theme={theme}
              onSelectJunction={(j) => setExplainJunction(j)}
              onOpenOverride={(j) => setOverrideJunction(j)}
            />

            {/* Right Column: Ranked Risk Locations */}
            <RankedRiskList
              junctionsWithRisk={junctionsWithRisk}
              aiAssignments={aiAssignments}
              officers={officers}
              simulatedIncident={simulatedIncident}
              onSelectJunction={(j) => setExplainJunction(j)}
              onOpenOverride={(j) => setOverrideJunction(j)}
              onTriggerIncident={handleTriggerIncident}
            />
          </div>
        </div>
      )}

      {/* Reusable Explainability Modal (C5) */}
      <ExplainabilityModal
        junction={explainJunction}
        onClose={() => setExplainJunction(null)}
        onSimulateIncident={handleTriggerIncident}
      />

      {/* Baseline vs AI Comparison Modal (C9) */}
      {showComparisonModal && (
        <BaselineComparison
          metrics={metrics}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      {/* Manual Supervisor Override Modal (C8) */}
      <ManualOverrideModal
        junction={overrideJunction}
        officers={officers}
        overrides={overrides}
        onSaveOverride={handleSaveOverride}
        onRemoveOverride={handleRemoveOverride}
        onClose={() => setOverrideJunction(null)}
      />

      {/* History Log Drawer */}
      <HistoryDrawer
        complaints={complaints}
        overrides={overrides}
        simulatedIncident={simulatedIncident}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Settings Modal */}
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
