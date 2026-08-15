# UI/UX Design Brief

## AI-Based Traffic Risk Heatmap and Police Deployment Decision Support — Nagpur City

**Version:** 1.0
**Date:** August 15, 2026

---

## 1. Project Snapshot

Two connected interfaces, one system:

1. **Citizen Reporting App** — simple, mobile-first, for filing traffic/civic complaints with evidence.
2. **Control Room Dashboard** — data-dense, desktop-first, for monitoring risk and directing officer deployment.

Same backend, two very different design jobs: one needs to be *fast and forgettable*, the other needs to be *trustworthy and scannable at a glance*.

---

## 2. Design Goals

| Goal | What it means in practice |
|---|---|
| Trust through transparency | Every AI recommendation shows its reasoning — no unexplained scores or silent decisions |
| Speed under pressure | Control room screens must be readable in a 2-3 second glance during an active incident |
| Low-friction reporting | A citizen should be able to file a complaint in under 60 seconds, without training |
| Human always in control | Override actions are one click away, never buried in menus |
| Calm, not alarming | Risk visualization should inform, not create panic — avoid overly aggressive red/siren-style UI |

---

## 3. Target Users & Design Implications

| User | Context of use | Design implication |
|---|---|---|
| Citizen (any age, mixed literacy) | On the street, one-handed, possibly poor network | Big tap targets, icon + text labels, works on 3G, minimal typing |
| Control room operator | Seated, multi-monitor, sustained attention over shifts | Information density is fine here, but grouping and hierarchy must be clear |
| Senior officer / commissioner | Occasional check-ins, decision-making | Needs summary views and comparison reports, not raw data |
| Field officer (secondary) | Mobile, glancing at instructions | Large, simple "go here" style cards if this persona is included in later phases |

---

## 4. Design Principles

1. **Explain, don't just display.** Every number on screen (a risk score, a coverage %) should be one click away from "why."
2. **Color means something specific.** Red/amber/green is reserved *only* for risk level — never reused for unrelated UI states (errors, buttons, etc.) to avoid confusion.
3. **Progressive disclosure.** Show the ranked list and map first; show factor breakdowns, officer details, and history only on demand.
4. **Consistency across both apps.** Same color system, same iconography, same terminology ("risk score," "coverage," "redeployment") so the two interfaces feel like one product.
5. **Design for the demo moment.** The live incident/redeployment view should be the single clearest, most polished screen in the whole system — it's your differentiator, design it accordingly.

---

## 5. Screen Inventory

### 5.1 Citizen App

| Screen | Purpose | Key elements |
|---|---|---|
| Home | Entry point | "Report an issue" primary button, "Track my complaint" secondary |
| New complaint | Capture the issue | Category picker (icons), map pin/auto-location, photo/video/audio upload, short text field |
| Confirmation | Close the loop on submission | Tracking ID, expected next step, "what happens next" microcopy |
| Track complaint | Status visibility | Status stepper (Received → Assigned → Resolved), timestamp, optional note from police |

### 5.2 Control Room Dashboard

| Screen | Purpose | Key elements |
|---|---|---|
| Main dashboard | Default landing view | Live heatmap (large, center), ranked risk list (side panel), active alert banner (unmanned hotspots/incidents) |
| Location detail | Explainability | Risk score breakdown (bar or donut of contributing factors), recent complaints feed, current officer assignment |
| Deployment view | Allocation management | Officer list with current location/status, assignment map, manual reassign control |
| Incident/redeployment view | Live incident handling | Before/after split view, highlighted affected zone, recommended officer move, coverage-gap warning, accept/override buttons |
| Comparison report | Baseline vs. AI | Side-by-side metrics (coverage %, unmanned hotspots, avg response distance), exportable |

---

## 6. Visual Design System

### 6.1 Color (semantic, not decorative)

| Color | Meaning | Usage |
|---|---|---|
| Red | High risk / active incident | Heatmap high-risk zones, incident alert banners |
| Amber | Medium risk | Heatmap medium zones, "attention needed" flags |
| Green | Low risk / covered | Heatmap low-risk zones, "coverage OK" indicators |
| Neutral gray/blue | Structural UI | Backgrounds, panels, non-risk text and controls |

Keep risk colors muted rather than saturated/neon — this is a monitoring tool used for extended periods, not a warning siren.

### 6.2 Typography

- One clean, highly legible sans-serif font family across both apps (e.g., Inter, Roboto, or similar).
- Citizen app: larger base font size (16px+) for readability on the move.
- Dashboard: slightly denser type scale is acceptable, but maintain a minimum 13-14px body size for sustained reading.

### 6.3 Iconography

- Simple, filled or outline icon set, consistent style throughout.
- Complaint categories (jam, accident, rash driving, parking) each get a distinct, recognizable icon — citizens should be able to identify the right one without reading.

### 6.4 Map Style

- Muted base map (light, low-saturation streets/labels) so risk color overlays stand out clearly.
- Marker size or intensity can optionally scale with risk score, in addition to color, for accessibility (don't rely on color alone).

---

## 7. Explainability Component (core differentiator — design this carefully)

This should be a reusable UI component, used identically wherever the AI shows a score or recommendation:

- A compact factor breakdown (e.g., horizontal stacked bar or small bar chart) showing the weighted contributors to a score.
- One line of plain-language summary above it (e.g., "High risk mainly due to a recent spike in complaints").
- Always visible via a single click/tap from the score itself — never buried more than one level deep.

---

## 8. Incident/Redeployment Screen (design this as your centerpiece)

Since this is the "wow moment" of the demo, give it deliberate visual treatment:

- Clear before/after framing — e.g., a split or toggle view: "Current deployment" vs. "Recommended after incident."
- The moved officer's path from old post to new post should be visually traceable on the map (a line or arrow), not just implied by two dots changing.
- The newly-uncovered post is visually flagged distinctly (e.g., outlined in amber, labeled "now uncovered") so the trade-off is honest and visible, not hidden.
- A single, clearly labeled accept/override action — this is the moment the "human stays in control" principle should be most visible.

---

## 9. Accessibility & Inclusivity

- Multilingual support for the citizen app at minimum: English, Hindi, Marathi.
- Don't rely on color alone to convey risk level — pair with icons, labels, or patterns for colorblind users.
- Citizen app should function on low-end Android devices and slower networks — keep media upload compression sensible, avoid heavy animations there.
- Dashboard should support keyboard navigation for control room accessibility compliance.

---

## 10. Tone & Microcopy Guidelines

- Citizen-facing text: plain, reassuring, action-oriented ("Your report has been received and is being reviewed").
- Control-room text: precise, factual, no dramatization ("3 high-risk locations currently unmanned" — not "Danger! Critical gaps detected!").
- Avoid police jargon in citizen-facing screens; avoid overly casual language in the control room.

---

## 11. Deliverables Checklist for the Design Phase

- [ ] Low-fidelity wireframes: citizen app (4 screens) + dashboard (5 screens)
- [ ] Color and typography style tile
- [ ] Explainability component design (reusable)
- [ ] High-fidelity mockup of the Incident/Redeployment screen (priority — this is your demo centerpiece)
- [ ] High-fidelity mockup of the main citizen complaint flow
- [ ] Clickable prototype covering the demo flow end-to-end

---

## 12. Success Criteria for the Design

- A first-time citizen user can file a complaint without instructions in under 60 seconds.
- A control room operator can identify the single highest-priority action on screen within 5 seconds of looking at the dashboard.
- Anyone watching the incident/redeployment demo can explain, unprompted, what just happened and why.

---

*End of Document*
