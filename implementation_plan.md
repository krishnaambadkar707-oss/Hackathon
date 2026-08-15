# Implementation Plan: AI-Based Traffic Risk Heatmap & Police Deployment Support (Nagpur City)

Build a full-stack interactive web application for the Nagpur Traffic Police & Citizens according to the hackathon PRD, UI/UX Design Brief, and App Web Flow documents.

## System Overview & Highlights

The project connects two primary user flows into one unified system:
1. **Citizen Reporting App**: Mobile-first, multilingual (English, Hindi, Marathi), sub-60s complaint filing with geo-location pin, evidence photo simulation, and live 3-stage status tracking (`Received` → `Assigned` → `Resolved`).
2. **Control Room Dashboard**: Data-dense desktop command center with live Leaflet heatmap of Nagpur junctions, explainability-first risk breakdown, greedy nearest-highest-risk police allocation algorithm, live incident simulation with dynamic redeployment & coverage-gap warning, baseline vs. AI comparison analytics, and manual supervisor overrides.

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Selection**: React + Vite + Leaflet / React-Leaflet + Lucide React + CSS Modules/Vanilla CSS with custom design tokens. State persistence will use LocalStorage with pre-seeded realistic Nagpur traffic data (18 key junctions, 45+ complaints, 12 active traffic officers).
> 
> **Single Application Dual-View Layout**: To ensure seamless demo navigation during hackathon presentation, a top navigation toggle allows instantaneous switching between **Citizen Reporting Mode** and **Control Room Command Center Mode**, while maintaining shared real-time state.

---

## Proposed Technical Architecture

```
/src
  /assets
    nagpur_junctions.json    # 18+ Real Nagpur traffic locations with coordinates & historical risk data
    seed_complaints.json     # Pre-loaded realistic citizen complaints
    seed_officers.json       # Pre-loaded police officer roster & initial deployment
  /components
    /common
      Navbar.jsx             # Mode switcher (Citizen App / Control Room Dashboard) & Status indicators
      ExplainabilityModal.jsx# Reusable AI Factor Breakdown modal & charts (C5)
      LanguageSelector.jsx   # English / Hindi / Marathi switcher for Citizen App
    /citizen
      CitizenHome.jsx        # Landing page with primary quick actions
      ComplaintForm.jsx      # Sub-60s complaint reporter with map location pin & photo attachment
      TrackComplaint.jsx     # Live complaint tracker with 3-stage status stepper
      ComplaintCard.jsx      # Card component for citizen feedback stream
    /controlroom
      DashboardHeader.jsx    # Live stats, active alert banners, Baseline vs AI toggle
      HeatmapView.jsx        # Leaflet map with custom colored risk overlays, officer markers, and assignment vectors
      RankedRiskList.jsx     # Sortable table of top-risk junctions with explainability triggers
      IncidentSimulator.jsx  # Centerpiece trigger for live incident & automated redeployment (C7)
      RedeploymentView.jsx   # Before/After split comparison with officer transfer line & coverage gap alert
      BaselineComparison.jsx # Side-by-side metric cards (Coverage %, Avg Response Distance, Hotspots Caught)
      ManualOverrideModal.jsx# Supervisor override modal with logged justification
  /services
    riskEngine.js            # PRD Section 6 Risk Scoring Model calculation formula
    allocationEngine.js      # PRD Section 7 Greedy Nearest-Highest-Risk matching algorithm
    storageService.js        # LocalStorage state management & pre-seeding
  /styles
    index.css                # Global design system tokens, typography, dark/light themes, custom map styling
  App.jsx                    # Core application router and state context
  main.jsx                   # Entry point
```

---

## Key Features & Component Breakdown

### 🟢 CORE Features Implementation Plan

1. **Citizen Complaint Form & Tracking (C1, S1)**
   - Category picker: *Traffic Jam*, *Accident Hazard*, *Rash Driving*, *Illegal Parking*.
   - Nagpur interactive location pin picker (defaulting to Sitabuldi / Sadar zone).
   - Instant tracking ID generation (e.g., `NGP-TRF-8831`) with multi-language microcopy.
   - Status tracking stepper with police action updates and timestamp.

2. **Risk Scoring Engine (C2)**
   - Implements formula: `Risk Score = (0.35 × Complaint Density) + (0.30 × Historical Accident) + (0.20 × Time-of-Day) + (0.15 × Road Attribute)`.
   - Normalizes scores 0–100 per location.

3. **Interactive Heatmap & Location Map (C3)**
   - Leaflet map centered on Nagpur city coordinates (`21.1458° N, 79.0882° E`).
   - Color-coded risk markers: 🟢 Low (<40), 🟡 Medium (40-60), 🔴 High (>60).
   - Police officer location pins with active assignment connection vectors.

4. **Explainability Panel (C5)**
   - Reusable component triggered by clicking any risk score badge or junction detail.
   - Shows plain language summary (e.g., *"High risk due to 48% complaint surge in evening peak and high accident history at Variety Square"*).
   - Visual percentage bar breakdown of the 4 score components.

5. **Personnel Allocation Algorithm & Greedy Matcher (C6)**
   - Nearest-highest-risk algorithm: matches available officers to top risk score locations within optimal distance.
   - Calculates total coverage % and average dispatch distance.

6. **Live Incident Simulation & Dynamic Redeployment (C7)**
   - "Simulate Incident" trigger button at any Nagpur location.
   - Instant score surge to 95+ (High Risk).
   - Auto-triggers redeployment: re-assigns nearest deployed officer.
   - Map draws animated transfer route line for officer.
   - Prominently flags old post with **AMBER/RED COVERAGE GAP WARNING**.

7. **Baseline vs. AI Deployment Comparison (C9)**
   - Toggle view comparing static baseline police deployment vs AI recommended deployment.
   - Displays headline stats: Coverage % (e.g. 40% -> 91%), Average Travel Distance (3.5km -> 1.1km), Unmanned Hotspots Prevented.

8. **Manual Supervisor Override (C8)**
   - Override button on any location / officer to manually change assignment.
   - Captures override reason and updates system state instantly.

---

## Verification Plan

### Automated Build & Lint Verification
- Execute `npm run build` to ensure clean TypeScript/JSX compilation and asset bundling with 0 errors.
- Execute unit verification scripts for `riskEngine.js` and `allocationEngine.js` formulas.

### Manual UX & Demo Verification
1. **Citizen Flow**:
   - File a new complaint at *Sitabuldi Square* in Hindi/English.
   - Note generated Tracking ID and check status page.
2. **Control Room Flow**:
   - Verify heatmaps rendered correctly with red/amber/green indicators on Nagpur junctions.
   - Click *Variety Square* risk score and verify Explainability breakdown modal opens.
   - Click "Simulate Live Incident at Law College Square" -> verify score spikings, officer redeployment line animation, and previous post coverage gap alert.
   - Verify Baseline vs AI comparison toggle updates stats and map layer.
   - Perform a manual override and confirm log update.
