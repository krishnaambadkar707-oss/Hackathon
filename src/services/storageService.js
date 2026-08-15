import { NAGPUR_JUNCTIONS } from "../data/nagpurJunctions";
import { SEED_OFFICERS } from "../data/seedOfficers";
import { SEED_COMPLAINTS } from "../data/seedComplaints";

const STORAGE_KEYS = {
  JUNCTIONS: "nagpur_traffic_junctions_v1",
  OFFICERS: "nagpur_traffic_officers_v1",
  COMPLAINTS: "nagpur_traffic_complaints_v1",
  OVERRIDES: "nagpur_traffic_overrides_v1",
  SIMULATED_INCIDENT: "nagpur_traffic_simulated_incident_v1",
  ACTIVE_VIEW_MODE: "nagpur_traffic_view_mode_v1",
  LANGUAGE: "nagpur_traffic_lang_v1"
};

export const storageService = {
  getJunctions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.JUNCTIONS);
    return data ? JSON.parse(data) : NAGPUR_JUNCTIONS;
  },

  getOfficers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.OFFICERS);
    return data ? JSON.parse(data) : SEED_OFFICERS;
  },

  getComplaints: () => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return data ? JSON.parse(data) : SEED_COMPLAINTS;
  },

  saveComplaint: (newComplaint) => {
    const complaints = storageService.getComplaints();
    const updated = [newComplaint, ...complaints];
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));
    return updated;
  },

  updateComplaintStatus: (complaintId, status, policeNote = "") => {
    const complaints = storageService.getComplaints();
    const updated = complaints.map((c) =>
      c.id === complaintId ? { ...c, status, policeNote: policeNote || c.policeNote } : c
    );
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));
    return updated;
  },

  getOverrides: () => {
    const data = localStorage.getItem(STORAGE_KEYS.OVERRIDES);
    return data ? JSON.parse(data) : {};
  },

  saveOverride: (junctionId, officerId, reason) => {
    const overrides = storageService.getOverrides();
    const updated = {
      ...overrides,
      [junctionId]: { officerId, reason, timestamp: new Date().toISOString() }
    };
    localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(updated));
    return updated;
  },

  removeOverride: (junctionId) => {
    const overrides = storageService.getOverrides();
    delete overrides[junctionId];
    localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(overrides));
    return overrides;
  },

  getSimulatedIncident: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SIMULATED_INCIDENT);
    return data ? JSON.parse(data) : null;
  },

  setSimulatedIncident: (incidentData) => {
    if (!incidentData) {
      localStorage.removeItem(STORAGE_KEYS.SIMULATED_INCIDENT);
    } else {
      localStorage.setItem(STORAGE_KEYS.SIMULATED_INCIDENT, JSON.stringify(incidentData));
    }
  },

  getViewMode: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW_MODE) || "CONTROL_ROOM"; // "CONTROL_ROOM" or "CITIZEN"
  },

  setViewMode: (mode) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW_MODE, mode);
  },

  getLanguage: () => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "EN"; // "EN", "HI", "MR"
  },

  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  resetAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.JUNCTIONS);
    localStorage.removeItem(STORAGE_KEYS.OFFICERS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.OVERRIDES);
    localStorage.removeItem(STORAGE_KEYS.SIMULATED_INCIDENT);
    return {
      junctions: NAGPUR_JUNCTIONS,
      officers: SEED_OFFICERS,
      complaints: SEED_COMPLAINTS,
      overrides: {},
      simulatedIncident: null
    };
  }
};
