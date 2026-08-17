# Technical Documentation: Nagpur Traffic AI & Police Deployment Command Center

> **Source of Truth Verification:** This document is generated exclusively from direct source code inspection of the project repository. All technical claims, architecture representations, algorithms, formulas, and dependency lists correspond to actual code implementations.

---

## 1. Project Overview

- **Project Name:** `nagpur-traffic-ai-hackathon` (Nagpur Traffic AI — Risk Heatmap & Police Deployment Command Center)
- **Short Description:** A single-page, real-time web application designed for Nagpur City Traffic Police and citizens. It combines citizen traffic incident reporting with an explainable AI risk scoring engine and a greedy personnel allocation algorithm to dynamically station and redeploy police officers across high-risk urban junctions.
- **Main Problem Being Solved:** Nagpur Traffic Police face fixed personnel constraints and lack data-driven tools to determine optimal officer placement, prioritize blackspots, or handle dynamic emergencies. Simultaneously, citizens lack a simple, trackable channel to report traffic hazards and gridlocks.
- **Main Solution:** An integrated dual-portal platform featuring:
  1. A mobile-optimized **Citizen Reporting App** (with multilingual support, quick form submission, and a natural language AI voice/text intake agent).
  2. An interactive **Control Room Dashboard** that calculates composite traffic risk scores (0–100) per junction, visualizes risk level heatmaps, automatically allocates patrol officers using a nearest-highest-risk greedy algorithm, simulates live emergency incident redeployment, and provides plain-language explainability with supervisor manual override capabilities.
- **Primary Users:**
  - **Nagpur Citizens & Commuters:** For reporting traffic issues (gridlocks, accident hazards, rash driving, illegal parking) and tracking resolution progress.
  - **Traffic Control Room Operators & Police Supervisors:** For monitoring city-wide risk heatmaps, viewing AI allocation recommendations, triggering emergency redeployments, and executing manual overrides.
- **Main Workflow:**
  `Citizen Report / Incident Simulation → Risk Scoring Engine (re-calculates weighted risk score) → Greedy Allocation Engine (assigns nearest police officers) → Heatmap & Ranked Risk HUD Update → Control Room Operator Decision / Override`

---

## 2. Programming Languages

| Language | Where Used | Evidence |
| :--- | :--- | :--- |
| **JavaScript (ES6+ / React JSX)** | Frontend UI components, state management, calculation engines, seed data | `src/App.jsx`, `src/main.jsx`, `src/services/riskEngine.js`, `src/services/allocationEngine.js`, `src/services/storageService.js`, `src/components/**/*.jsx`, `src/data/*.js`, `vite.config.js` |
| **HTML5** | Application entry point shell | `index.html` |
| **CSS3** | Global design tokens, custom HUD themes, Leaflet marker pulse keyframes, glassmorphism UI | `src/styles/index.css` |
| **JSON** | Dependencies, scripts, deployment rewrites | `package.json`, `package-lock.json`, `vercel.json` |
| **TOML** | Netlify deployment configuration | `netlify.toml` |
| **Markdown** | Technical specifications & project documentation | `README.md`, `PRD_Hackathon_Nagpur_Traffic_AI_main.md`, `UIUX_Design_Brief_Nagpur.md` |

> [!NOTE]
> **Python Status:** Python dependencies (`fastapi`, `uvicorn`, `pandas`, `scikit-learn`, `opencv-python-headless`, etc.) are declared in `requirements.txt`. However, **no active Python (`.py`) execution source files exist** in the workspace codebase. All application logic runs client-side in JavaScript.

---

## 3. Frontend

- **Frontend Framework:** React 18 (`react` ^18.2.0, `react-dom` ^18.2.0)
- **UI Libraries:** Lucide React (`lucide-react` ^0.344.0) for tactical HUD vector icons
- **CSS Framework:** Custom Vanilla CSS (`src/styles/index.css`) utilizing CSS Custom Properties (Variables), Flexbox, CSS Grid, custom glassmorphism backdrops (`backdrop-filter: blur(16px)`), dark/light theme tokens (`data-theme`), and command-room background toggles.
- **Component Libraries:** Custom modular React components organized into `citizen`, `controlroom`, and `common` subdirectories.
- **Build Tool:** Vite 5 (`vite` ^5.1.6, `@vitejs/plugin-react` ^4.2.1)
- **Mapping Library:** Leaflet 1.9.4 (`leaflet` ^1.9.4, `react-leaflet` ^4.2.1) with CARTO raster tile basemaps (`dark_all` for dark mode, `voyager` for light mode).
- **Chart / Visualization Libraries:** Custom CSS progress bars, score badges, and metric cards (no third-party charting library installed).
- **State Management:** React native Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) coupled with a custom wrapper service (`storageService`) managing browser `localStorage`.
- **Routing:** Internal state-driven view mode switching (`viewMode`: `CONTROL_ROOM`, `CITIZEN`, `ANALYTICS`, `DEPLOYMENT`, `INCIDENT_LOGS`) and sidebar sub-view switching (`activeSubView`: `MAP_OVERVIEW`, `INCIDENT_LOGS`, `RISK_HEATMAP`, `RESOURCE_HUB`, `SIMULATION`).
- **Important Frontend Dependencies:**
  - `leaflet` (v1.9.4) → Core GIS mapping engine
  - `react-leaflet` (v4.2.1) → React bindings for map container, tiles, markers, popups, and polylines
  - `lucide-react` (v0.344.0) → Iconography for navigation, alerts, and metrics
  - `react` / `react-dom` (v18.2.0) → UI component framework

---

## 4. Backend

- **Backend Language:** Client-side JavaScript service abstraction (`src/services/storageService.js`). No server-side runtime code (Node.js/Python) is active in the codebase.
- **Backend Framework:** Not detected / cannot be confirmed from source code. (No Express, FastAPI, or Django server file found).
- **API Architecture:** Client-side in-memory service layer backed by browser `localStorage` persistence and static seed datasets.
- **Important Routes / Endpoints:** No external HTTP REST API endpoints exist in the active codebase. All operations execute via client-side function calls.
- **Request / Response Flow:**
  `Component Interaction → Call storageService Method → Read/Write localStorage → Update React State → Recompute useMemo Calculations`
- **CORS Configuration:** Handled at web server level via SPA rewrite rules in `vercel.json` (`/.*` -> `/index.html`) and `netlify.toml` (`/*` -> `/index.html`, 200). No backend CORS middleware exists in code.
- **Middleware:** None implemented.
- **Important Backend Libraries:** None present in active execution code.

---

## 5. Database & Storage

- **Database Technology:** Browser `localStorage` key-value store (`STORAGE_KEYS`). No external database server (PostgreSQL, MongoDB, Firebase) is connected in source code.
- **Database Library / ORM:** Custom `storageService` abstraction module (`src/services/storageService.js`).
- **Collections / Entities / Keys:**
  1. `nagpur_traffic_junctions_v1` → Array of 15 Nagpur junction records (`id`, `name`, `zone`, `lat`, `lng`, `historicalAccidentsScore`, `roadAttributeScore`, `roadAttributesText`, `complaintDensityScore`, `timeOfDayScore`, `landmark`, `baselineOfficerAssigned`, `baselineOfficerId`).
  2. `nagpur_traffic_officers_v1` → Array of 10 police officer records (`id`, `name`, `badgeNumber`, `rank`, `phone`, `unit`, `vehicle`, `lat`, `lng`, `status`, `currentJunctionId`, `speedKm`).
  3. `nagpur_traffic_complaints_v1` → Array of citizen report records (`id`, `junctionId`, `junctionName`, `citizenName`, `category`, `categoryLabel`, `description`, `photoUrl`, `timestamp`, `status`, `assignedOfficerId`, `assignedOfficerName`, `upvotes`, `policeNote`).
  4. `nagpur_traffic_overrides_v1` → Key-value dictionary of supervisor manual overrides (`junctionId` → `{ officerId, reason, timestamp }`).
  5. `nagpur_traffic_simulated_incident_v1` → Emergency simulation state (`junctionId`, `junctionName`, `redeployedOfficerId`, `uncoveredJunctionId`, `timestamp`).
  6. `nagpur_traffic_view_mode_v1` & `nagpur_traffic_lang_v1` → Active navigation view and locale selection.
- **File / Image Storage:** Static asset references served via Unsplash CDN (e.g. `https://images.unsplash.com/...`), local public assets (`/favicon.svg`), and root asset overlays (`screen_1.png`).
- **Data Communication:** Synchronous function calls to `storageService` methods (`getJunctions`, `getOfficers`, `getComplaints`, `saveComplaint`, `saveOverride`, `removeOverride`, `setSimulatedIncident`).

---

## 6. AI / ML / Algorithms

The application implements six distinct algorithmic and rule-based decision mechanisms. None of these use heavy deep learning or external ML inference APIs; all are deterministic, transparent, and explainable.

### 1. Weighted Traffic Risk Scoring Model
- **Name:** Weighted Multi-Factor Risk Engine (`calculateRiskScore`)
- **Input:** Junction attributes (`complaintDensityScore`, `historicalAccidentsScore`, `timeOfDayScore`, `roadAttributeScore`), active complaints array, active simulated incident ID.
- **Processing:**
  1. Calculates `complaintDensity = Math.min(100, baseScore + activeComplaints.length * 12)`.
  2. Applies a `1.15x` time-of-day peak-hour multiplier during rush hours (08:30–10:30 & 17:30–21:00).
  3. Computes weighted sum: `(0.35 × complaintDensity) + (0.30 × historicalAccidents) + (0.20 × timeOfDay) + (0.15 × roadAttributes)`.
  4. If a live incident is simulated at the junction, boosts score by `+35` (minimum score floor `96`).
- **Output:** Numerical risk score (0–100), risk level category (`HIGH`, `MEDIUM`, `LOW`), color code, factor breakdown list, and plain-language summary text.
- **Where Implemented:** [riskEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/riskEngine.js#L10-L115)
- **Relevant Library:** Pure JavaScript (`Math` functions, `Date`)
- **Classification:** Mathematical Formula / Rule-Based Scoring Engine

### 2. Geodesic Distance Calculation
- **Name:** Haversine Distance Formula (`calculateDistanceKm`)
- **Input:** Latitude 1, Longitude 1, Latitude 2, Longitude 2
- **Processing:** Calculates great-circle distance on a spherical Earth (radius R = 6371 km).
- **Output:** Distance in kilometers between two GPS coordinates (rounded to 2 decimal places).
- **Where Implemented:** [allocationEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/allocationEngine.js#L7-L19)
- **Relevant Library:** Pure JavaScript (`Math.PI`, `Math.sin`, `Math.cos`, `Math.atan2`, `Math.sqrt`)
- **Classification:** Geospatial Calculation / Mathematical Formula

### 3. Police Personnel Allocation & Redeployment Algorithm
- **Name:** Greedy Nearest-Highest-Risk Matching Algorithm (`runAIAllocation`)
- **Input:** Risk-scored junctions list, available officers list, manual overrides map.
- **Processing:**
  1. Processes supervisor manual overrides first, locking designated officers to target junctions.
  2. Sorts remaining junctions descending by risk score.
  3. For each junction, iterates through unassigned officers and calculates Haversine distance.
  4. Assigns the nearest available officer to the highest-risk unassigned junction.
  5. Flags any `HIGH` risk junction left unassigned as an "Unmanned High Risk Hotspot".
- **Output:** Object containing `assignments` array, `assignedOfficerIds` set, `assignedJunctionIds` set, and `unmannedHighRiskHotspots` list.
- **Where Implemented:** [allocationEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/allocationEngine.js#L21-L99)
- **Relevant Library:** Pure JavaScript (`Array.prototype.sort`, `Array.prototype.forEach`, `Set`)
- **Classification:** Heuristic Optimization / Greedy Matching Algorithm

### 4. Baseline vs. AI Impact Comparison Engine
- **Name:** Baseline Metric Calculator (`calculateBaselineVsAIMetrics`)
- **Input:** `junctionsWithRisk`, `aiAssignments`, `officers`
- **Processing:** Evaluates fixed baseline police deployment vs. AI greedy allocation across: High-Risk Zone Coverage %, Average Officer Transit Radius (km), and Unmanned Hotspots Prevented.
- **Output:** Quantitative improvement metrics (`coverageBoost`, `distanceSavedKm`, `hotspotsPrevented`).
- **Where Implemented:** [allocationEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/allocationEngine.js#L104-L168)
- **Relevant Library:** Pure JavaScript
- **Classification:** Statistical Comparison Algorithm

### 5. Multilingual Citizen AI NLP Parser
- **Name:** Keyword & Pattern Intent Extractor (`handleExtractAndFill`)
- **Input:** Natural language speech/text string in Hindi, Marathi, Hinglish, or English.
- **Processing:**
  - Extracts 10-digit mobile numbers using regular expression `/\b\d{10}\b/`.
  - Matches category keywords (`accident`, `hazard`, `crash` → `ACCIDENT_HAZARD`; `rash`, `signal` → `RASH_DRIVING`; `parking` → `ILLEGAL_PARKING`; `jam` → `JAM`).
  - Matches junction names/landmarks (`law college`, `variety`, `chhatrapati`, `buldi`).
  - Extracts reporter name via regex pattern matching (`/(?:my name is|naam|naav|by)\s+([A-Za-z\s]+)/i`).
- **Output:** Structured report object (`junctionId`, `category`, `citizenName`, `citizenPhone`, `urgency`).
- **Where Implemented:** [CitizenAIReportAgent.jsx](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/components/citizen/CitizenAIReportAgent.jsx#L26-L92)
- **Relevant Library:** Pure JavaScript (RegExp, String methods)
- **Classification:** Rule-Based NLP Keyword Extraction

### 6. Conversational AI Traffic Assistant
- **Name:** "Nagpur Traffic AI Mitr" Response Generator (`generateAIResponse`)
- **Input:** User query text in chat widget.
- **Processing:** Evaluates query intent against junction risk data, officer rosters, emergency helplines, and complaint filing instructions.
- **Output:** Formatted markdown response text with real-time score injection.
- **Where Implemented:** [AIAssistantWidget.jsx](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/components/common/AIAssistantWidget.jsx#L32-L69)
- **Relevant Library:** Pure JavaScript
- **Classification:** Rule-Based Conversational Logic

---

## 7. Traffic Risk Scoring

### Actual Implementation Formula
Found in [riskEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/riskEngine.js#L35-L49):

$$\text{Risk Score (0--100)} = \min\Big(100, \text{round}\big(0.35 \times \text{ComplaintDensity} + 0.30 \times \text{HistoricalAccidents} + 0.20 \times \text{TimeOfDayFactor} + 0.15 \times \text{RoadAttributes}\big)\Big)$$

Where:
- $\text{ComplaintDensity} = \min\big(100, \text{baseComplaintScore} + \min(\text{activeComplaints.length} \times 12, 40)\big)$
- $\text{HistoricalAccidents} = \text{junction.historicalAccidentsScore}$ (default 50)
- $\text{TimeOfDayFactor} = \text{timeOfDayScore} \times 1.15$ during rush hours (08:30–10:30 & 17:30–21:00), otherwise $\text{timeOfDayScore}$
- $\text{RoadAttributes} = \text{junction.roadAttributeScore}$ (default 50)
- **Emergency Incident Elevation:** If `simulatedIncidentId === junction.id`, raw score becomes $\max(96, \text{rawScore} + 35)$.

### Risk Categories & Thresholds
- **HIGH RISK (Red `#EF4444`):** Score $\ge 70$
- **MEDIUM RISK (Amber `#F59E0B`):** $45 \le \text{Score} < 70$
- **LOW RISK (Emerald Green `#10B981`):** Score $< 45$

### Score Updates
Scores re-calculate automatically in `src/App.jsx` using React `useMemo` whenever `junctions`, `complaints`, or `simulatedIncident` state changes.

---

## 8. Heatmap / Geospatial System

- **Mapping Library:** Leaflet 1.9.4 (`leaflet`) with React Leaflet (`react-leaflet` 4.2.1).
- **Map Provider:** CARTO Tile CDN (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` in Dark Mode, `voyager` in Light Mode).
- **Geographic Data Source:** [nagpurJunctions.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/data/nagpurJunctions.js) containing 15 real Nagpur junctions with coordinates (e.g., Variety Square `21.1458, 79.0882`, Law College Square `21.1490, 79.0560`, Chhatrapati Square `21.1110, 79.0690`).
- **Map Center & Bounds:** Center `[21.1458, 79.0882]`, Max Bounds `[[20.85, 78.85], [21.35, 79.35]]`, Zoom `13`.
- **Heatmap Implementation:** Custom Leaflet `L.divIcon` markers with CSS keyframe pulse rings (`pulse-red-marker`, `pulse-amber-marker`, `pulse-cyan-marker`) displaying the score integer.
- **Markers & Layers:**
  - **Junction Risk Markers:** Color-coded circles showing numerical scores.
  - **Officer Patrol Markers:** Cyan shield icons (`L.divIcon`) showing badge numbers and patrol vehicles.
  - **Dispatch Polylines:** Dashed `Polyline` elements connecting officers to assigned junctions (cyan for AI assigned, amber for manual override, red for live incident redeployment).
  - **Coverage Gap Marker:** Dashed amber `CircleMarker` indicating an unmanned junction left behind during emergency redeployment.
- **Geographic Calculations:** Haversine distance (`calculateDistanceKm`) for assignment matrix, `map.flyTo()` smooth pan/zoom when a junction is selected.

---

## 9. Personnel Allocation & Redeployment

- **Officer Representation:** 10 officer objects (`id`, `name`, `badgeNumber`, `rank`, `unit`, `vehicle`, `lat`, `lng`, `status`, `currentJunctionId`).
- **Location Representation:** 15 Nagpur junction objects (`id`, `name`, `lat`, `lng`, `risk`).
- **Distance Calculation:** Haversine great-circle distance in kilometers.
- **Assignment Logic:**
  1. Manual overrides assigned first.
  2. Remaining junctions sorted descending by risk score.
  3. Highest risk junction claims nearest available unassigned officer.
- **Unassigned Officers:** Remain in `PATROLLING` state with last-known coordinates.
- **High-Risk Prioritization:** Strictly enforced by sorting junctions by score prior to matching.
- **Live Incident & Redeployment Flow:**
  - When an incident is triggered (`handleTriggerIncident` in `src/App.jsx`), the target junction's risk score is boosted to $\ge 96$.
  - The algorithm identifies the nearest non-incident assigned officer (e.g., SI Amit Patil) and redeploys them to the emergency location.
  - The former junction (e.g., Law College Sq) is flagged as `uncoveredJunctionId` ("Coverage Gap").

---

## 10. Citizen Complaint Workflow

```
User → Citizen Home → Choice (AI Voice/Text Agent OR Standard Form) → Input Validation → Geotagged Junction Selection → Submission (`handleAddComplaint`) → localStorage (`saveComplaint`) → React State Update (`setComplaints`) → Risk Engine Recalculation → Heatmap Pulse & Ranked List Update
```

- **Complaint Fields:** `id` (`NGP-TRF-2026-xxxx`), `junctionId`, `junctionName`, `citizenName`, `category` (`JAM`, `ACCIDENT_HAZARD`, `RASH_DRIVING`, `ILLEGAL_PARKING`), `categoryLabel`, `description`, `photoUrl`, `timestamp`, `status` (`RECEIVED`, `ASSIGNED`, `RESOLVED`), `assignedOfficerId`, `assignedOfficerName`, `upvotes`, `policeNote`.
- **Validation:** Required fields enforced on category selection, junction picker, and description text.
- **Photo Upload:** Simulated geotagged camera preview with Unsplash sample media.
- **Status Tracking:** 3-step progress stepper (`Received` → `Assigned` → `Resolved`) queryable by tracking ID in `TrackComplaint.jsx`.

---

## 11. Dashboard / UI Architecture

- **Main Navigation Tabs (Navbar):**
  - `CONTROL ROOM` → Main Tactical GIS Command Interface
  - `INCIDENT LOGS` → Real-Time Audit Log & Event Timeline
  - `CITIZEN REPORTING` → Mobile PWA Simulator for Citizen Reporting
  - `ANALYTICS` → AI vs. Baseline Performance Evaluation
  - `DEPLOYMENT` → Police Roster Hub & Officer Management
- **Left HUD Command Sidebar (Control Room):**
  - `MAP OVERVIEW`, `INCIDENT LOGS`, `RISK HEATMAP`, `RESOURCE HUB`, `SIMULATION`
  - Quick action buttons: `✳ DISPATCH` and `((•)) SYSTEM STATUS`
- **Dashboard Sections:**
  - **Top Floating KPI Header:** Live metrics for AI Coverage Rate %, Avg Dispatch Radius (km), and Unmanned Hotspots Count.
  - **Center GIS Map:** Leaflet map with zoom controls, weather pill (`30°C CLOUDY`), and junction search bar.
  - **Right Ranked Risk Panel:** Filterable list of all 15 junctions sorted by risk score with `EXPLAIN` and `REASSIGN` buttons.
  - **Simulation Banner:** Emergency control bar for triggering live collisions.
  - **Modals:** `ExplainabilityModal` (factor breakdown), `ManualOverrideModal` (supervisor overrides), `BaselineComparison` (impact report), `SettingsModal` (theme & audio), `HistoryDrawer` (audit trail), `AIAssistantWidget` (conversational bot).

---

## 12. API Documentation

> [!NOTE]
> All services execute client-side via JavaScript abstraction methods. No external HTTP server endpoints exist.

| Method / Call | Target Entity | Purpose | Request Parameters | Response / Output | Source File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `getJunctions()` | `JUNCTIONS` | Retrieve list of Nagpur junctions | None | Array of 15 junction objects | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L16) |
| `getOfficers()` | `OFFICERS` | Retrieve police patrol roster | None | Array of 10 officer objects | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L21) |
| `getComplaints()` | `COMPLAINTS` | Retrieve citizen complaints | None | Array of complaint objects | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L26) |
| `saveComplaint()` | `COMPLAINTS` | Store new citizen report | `newComplaint` object | Updated complaints array | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L31) |
| `saveOverride()` | `OVERRIDES` | Record supervisor manual override | `junctionId`, `officerId`, `reason` | Updated overrides map | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L52) |
| `removeOverride()` | `OVERRIDES` | Delete manual override | `junctionId` | Updated overrides map | [storageService.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/storageService.js#L62) |
| `calculateRiskScore()` | Risk Engine | Compute composite risk score | `junction`, `activeComplaints`, `simulatedIncidentId` | Risk score object & breakdown | [riskEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/riskEngine.js#L10) |
| `runAIAllocation()` | Allocation Engine | Run greedy officer assignment | `junctionsWithRisk`, `officers`, `manualOverrides` | Assignments & unmanned list | [allocationEngine.js](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/services/allocationEngine.js#L21) |

---

## 13. Project Architecture

### Architecture Text Diagram
```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  |  Control Room HUD  |  |  Citizen Mobile    |  | Analytics & Deployment Hub  |  |
|  |  (React / Leaflet) |  |  PWA Simulator     |  | (Metrics & Roster)          |  |
|  +---------+----------+  +---------+----------+  +--------------+--------------+  |
+------------|-----------------------|--------------------------|-------------------+
             |                       |                          |
             v                       v                          v
+-----------------------------------------------------------------------------------+
|                                REACT APP ENGINE (App.jsx)                         |
|  - Main View Routing (CONTROL_ROOM, CITIZEN, ANALYTICS, DEPLOYMENT, LOGS)         |
|  - State Hooks (junctions, officers, complaints, overrides, simulatedIncident)    |
|  - Real-time Computed Properties (useMemo: junctionsWithRisk, aiAssignments)       |
+------------+-----------------------+--------------------------+-------------------+
             |                       |                          |
             v                       v                          v
+------------------------+  +------------------------+  +---------------------------+
|   RISK SCORING ENGINE  |  |   ALLOCATION ENGINE    |  |     STORAGE SERVICE       |
|  (riskEngine.js)       |  |  (allocationEngine.js) |  |   (storageService.js)     |
|  - 4-Factor Weighted   |  |  - Haversine Distance  |  |   - LocalStorage Wrapper  |
|    Formula Calculation |  |  - Greedy Matching     |  |   - Seed Datasets Sync    |
|  - Time & Emergency    |  |  - Baseline Comparison |  |   - Persistence Management|
|    Score Boosts        |  |  - Gap Detection       |  |                           |
+------------------------+  +------------------------+  +-------------+-------------+
                                                                      |
                                                                      v
                                                        +---------------------------+
                                                        |   BROWSER LOCALSTORAGE    |
                                                        | (nagpur_traffic_*_v1)     |
                                                        +---------------------------+
```

### Data Flow Step-by-Step
1. **App Initialization:** `App.jsx` mounts and requests initial datasets from `storageService`. If `localStorage` is empty, default seed arrays from `nagpurJunctions.js`, `seedOfficers.js`, and `seedComplaints.js` are loaded.
2. **Risk Calculation:** `useMemo` triggers `calculateRiskScore()` for each junction, evaluating complaint count, historical accident rating, rush hour time factors, and active emergency simulation state.
3. **Personnel Matching:** `useMemo` passes `junctionsWithRisk` and `officers` to `runAIAllocation()`. Overrides are locked first, then remaining junctions are sorted by risk score and assigned to nearest officers via Haversine distance calculations.
4. **UI Render:** Leaflet map renders pulse markers, polylines, and popups. Sidebar updates ranked risk order. Header displays aggregate KPIs.
5. **State Mutation:** When a complaint is submitted or an override saved, `storageService` writes to `localStorage` and updates React state, triggering an immediate recalculation of scores and map markers.

---

## 14. Dependencies

### Frontend Dependencies (`package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `leaflet` | `^1.9.4` | Core open-source interactive map library |
| `react-leaflet` | `^4.2.1` | React components wrapper for Leaflet map elements |
| `lucide-react` | `^0.344.0` | Tactical HUD vector icons for UI controls |
| `react` | `^18.2.0` | Core UI framework library |
| `react-dom` | `^18.2.0` | React DOM renderer |
| `vite` | `^5.1.6` | Development server and fast production bundler |
| `@vitejs/plugin-react` | `^4.2.1` | Vite plugin for React JSX transformation & HMR |
| `@types/leaflet` | `^1.9.8` | TypeScript definitions for Leaflet |
| `@types/react` | `^18.2.66` | TypeScript definitions for React |
| `@types/react-dom` | `^18.2.22` | TypeScript definitions for React DOM |

### Backend Dependencies (`requirements.txt` - Declared but Unused)

| Package | Purpose Specified in `requirements.txt` |
| :--- | :--- |
| `fastapi` | Web Framework & API Server |
| `uvicorn[standard]` | ASGI Web Server |
| `requests` | HTTP Client Library |
| `python-multipart` | Multipart Form Data Parser |
| `numpy` | Numerical Data Processing |
| `pandas` | Data Analytics & Tabular Operations |
| `scipy` | Scientific & Optimization Calculations |
| `scikit-learn` | Machine Learning Library |
| `joblib` | Model Serialization |
| `opencv-python-headless` | Image & Video Processing |
| `pillow` | Image Processing |
| `pydantic` | Data Validation |
| `python-dotenv` | Environment Variable Management |

---

## 15. Deployment-Relevant Information

- **Frontend Build Command:** `npm run build` (`vite build`)
- **Frontend Dev Start Command:** `npm run dev` (`vite`)
- **Frontend Preview Command:** `npm run preview` (`vite preview`)
- **Build Output Directory:** `dist`
- **Required Environment Variables:** None required. All application state runs client-side with static assets and `localStorage`.
- **Configured Server Port:** `3000` (defined in `vite.config.js`).
- **API Base URL Configuration:** N/A (client-side in-memory architecture).
- **CORS Requirements:** None for static hosting. Single Page Application (SPA) fallback rewrites configured for root routing in `vercel.json` (`rewrites` `/(.*)` -> `/index.html`) and `netlify.toml` (`redirects` `/*` -> `/index.html`, `status = 200`).
- **Database Connection Requirements:** None.
- **External Network Services:**
  - CARTO Tile CDN (`https://{s}.basemaps.cartocdn.com`)
  - Unsplash Image CDN (`https://images.unsplash.com`)
  - Google Fonts CDN (`https://fonts.googleapis.com`)
- **Inference Hardware Requirements:** CPU-light / Standard web browser execution (no GPU required).
- **Large Model / Weight Files:** None present.
- **Docker Configuration:** No `Dockerfile` or `docker-compose.yml` present in repository.
- **Deployment Risks:**
  1. Reliance on external CDN assets (CARTO tiles, Unsplash images).
  2. Data resetting on clearing browser cache / `localStorage`.
  3. Unused `requirements.txt` causing confusion if deployed to Python hosting environments (e.g., Heroku auto-detecting Python instead of Node.js/Vite).

---

## 16. Security & Secrets

- **Environment Variables Required:** None.
- **Authentication System:** Simulated user role badges (e.g. `Commander R. Verma (Nagpur HQ)`). No backend OAuth/JWT authentication implemented.
- **API Keys Required:** None. Leaflet uses public CARTO map tiles.
- **Secret Audit:** Verified that no production API keys, passwords, credentials, or private tokens exist in any file across the repository.

---

## 17. Testing / Validation

- **Automated Test Suite:** No automated unit or end-to-end test files (`*.test.js`, `*.spec.js`, `jest.config.js`) exist in the project directory.
- **Validation Logic:** Client-side form input validation in [ComplaintForm.jsx](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/components/citizen/ComplaintForm.jsx#L31-L55) and [ManualOverrideModal.jsx](file:///c:/Users/krish/OneDrive/Desktop/Hackathon/src/components/controlroom/ManualOverrideModal.jsx#L11-L16).
- **Health Check Endpoints:** None implemented.

---

## 18. Actual vs. Planned Features

### Actually Implemented (Confirmed by Source Code)
- [x] Interactive GIS map powered by Leaflet & CARTO tiles with custom pulse markers.
- [x] 4-Factor Weighted Traffic Risk Scoring Model with rush-hour multipliers.
- [x] Greedy Nearest-Highest-Risk Personnel Allocation Engine using Haversine distance.
- [x] Live Incident Simulator elevating target risk and executing dynamic officer redeployment.
- [x] Coverage Gap detection flagging former posts left unmanned during emergencies.
- [x] Supervisor Manual Override modal logging reassignments and custom reasons.
- [x] Baseline vs. AI Side-by-Side Comparison modal showing coverage boost & distance saved.
- [x] Mobile PWA Citizen Reporting view with 3-step resolution progress stepper.
- [x] Multilingual Citizen AI Voice/Text Intake Agent (Hindi, Marathi, Hinglish, English NLP parsing).
- [x] Floating "Nagpur Traffic AI Mitr" conversational chat assistant.
- [x] Dual visual themes (Dark Control Room HUD vs. Light High-Contrast Mode) & Command Room background toggle (`screen_1.png`).
- [x] Browser `localStorage` persistence for complaints, roster, overrides, and settings.

### Mentioned / Planned in PRD / README but NOT Implemented in Code
- [ ] Backend REST API server (FastAPI / Express).
- [ ] Persistent SQL/NoSQL database (PostgreSQL / PostGIS / Firebase).
- [ ] Real Machine Learning / Deep Learning model (scikit-learn / PyTorch / OR-Tools).
- [ ] Real-time GPS device tracking or live CCTV feed integration.
- [ ] Automated SMS / Push notification service integration.
- [ ] Automated unit test suite.
- [ ] Multi-user authentication & role-based access control (RBAC).

---

## 19. Technology Stack — PPT Ready

| Layer | Actual Technology Implemented |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite 5 Build Tool) |
| **User Interface** | Custom Vanilla CSS (Design Tokens, Glassmorphism, Theme Engine) |
| **Iconography** | Lucide React |
| **GIS Mapping** | Leaflet 1.9.4 + React Leaflet 4.2.1 + CARTO Tiles |
| **State Persistence** | Browser LocalStorage via `storageService` abstraction |
| **Risk Scoring Engine** | Client-Side 4-Factor Weighted Mathematical Formula |
| **Allocation Engine** | Client-Side Greedy Nearest-Highest-Risk Haversine Algorithm |
| **Natural Language Processing** | Client-Side Multilingual Regex & Keyword NLP Extractor |
| **Hosting & Deployment** | Static SPA Deployment (Vercel / Netlify / Vite Server) |

---

## 20. PPT Technology Summary

- **Programming Languages:** JavaScript (ES6+ / React JSX), HTML5, CSS3, JSON, TOML
- **Frameworks:** React 18, Vite 5
- **Libraries:** Leaflet 1.9.4, React Leaflet 4.2.1, Lucide React 0.344.0
- **Database / Storage:** Browser `localStorage` with custom JavaScript service layer
- **APIs:** Client-Side Service Layer (no external backend REST APIs)
- **AI / ML:** Rule-based 4-Factor Risk Scoring Engine + Multilingual Keyword NLP Parser
- **Algorithms:** Haversine Great-Circle Distance + Greedy Nearest-Highest-Risk Officer Allocation Algorithm
- **Deployment:** Static Single Page Application (Port `3000`, `dist` build output, Vercel/Netlify rewrites)
- **Key Technical Innovation:** Explainable multi-factor traffic risk scoring coupled with dynamic greedy officer redeployment and live coverage gap detection.

---

## 21. Potential Deployment / Presentation Issues

The following technical issues were identified during direct source code analysis:

1. **Unused Backend Declarations:** `requirements.txt` specifies Python dependencies (`fastapi`, `pandas`, `scikit-learn`), but no Python code exists in the repository. Deploying to platforms like Heroku may cause build failures if the platform misidentifies the project as Python.
2. **Hardcoded CDN Asset Dependencies:** Map tiles require internet access to CARTO servers (`basemaps.cartocdn.com`), and images depend on Unsplash (`images.unsplash.com`). Offline demos will fail to render map tiles and complaint photos.
3. **Port Lock in Dev Mode:** `vite.config.js` hardcodes port `3000`. If port 3000 is occupied, Vite will fail unless configured with fallback flags.
4. **Data Persistence Boundary:** Clearing browser storage resets all added citizen complaints and manual overrides back to initial seed data.
5. **Lack of Automated Tests:** No test files exist, requiring manual UI testing before live demonstration.
